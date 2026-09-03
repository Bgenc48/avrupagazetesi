#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'src', 'content', 'articles');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.md')).sort();
const slugs = new Set(files.map((name) => name.replace(/\.md$/i, '')));
const officialHosts = [
  'europa.eu', 'ec.europa.eu', 'eur-lex.europa.eu', 'europarl.europa.eu',
  'coe.int', 'europol.europa.eu', 'eu-osha.europa.eu', 'ecb.europa.eu',
  'eures.europa.eu', 'mfa.gov.tr', 'konsolosluk.gov.tr', 'nvi.gov.tr',
  'turkiye.gov.tr', 'sgk.gov.tr', 'gov.uk', 'bund.de', 'service-public.fr',
  'government.nl', 'belgium.be', 'oesterreich.gv.at', 'admin.ch', 'gov.ie',
  'lifeindenmark.borger.dk', 'udi.no', 'migrationsverket.se', 'who.int',
  'oecd.org', 'un.org', 'make-it-in-germany.com', 'gesetze-im-internet.de',
  'antidiskriminierungsstelle.de', 'service.berlin.de', 'bamf.de',
  'familienportal.de', 'verbraucherzentrale.de', 'polizei-beratung.de',
  'rundfunkbeitrag.de', 'bundeswahlleiterin.de', 'ysk.gov.tr',
  'bundesregierung.de', 'gleichbehandlungsanwaltschaft.gv.at',
  'migration.gv.at', 'berufsanerkennung.at', 'ipc.gov.cz', 'mv.gov.cz',
  'nyidanmark.dk', 'infofinland.fi', 'kela.fi', 'migri.fi',
  'impots.gouv.fr', 'caf.fr', 'ind.nl', 'nhs.uk', 'england.nhs.uk',
  'workplacerelations.ie', 'ihrec.ie', 'inclusion.gob.es', 'interior.gob.es',
  'do.se', 'agenziaentrate.gov.it', 'esteri.it', 'salute.gov.it',
  'skatteetaten.no', 'gov.pt', 'aima.gov.pt', 'portaldasfinancas.gov.pt',
  'ptt.gov.tr',
];
const filler = [
  /bu kapsamlı rehber/i,
  /günümüzün hızla değişen dünyasında/i,
  /^(?:> )?sonuç olarak[, ]/im,
  /unutulmamalıdır ki/i,
  /detaylı bilgi için uzmanımıza/i,
  /bu yazıda ele alacağız/i,
  /\bseo\b|anahtar kelime yoğunluğu/i,
];

function fields(raw) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const output = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (/^".*"$/.test(value)) value = JSON.parse(value);
    output[match[1]] = value;
  }
  return output;
}

const issues = [];
const counts = [];
const heroUse = new Map();
for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8');
  const data = fields(raw);
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  const plain = body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/[#>*_`|\[\]()!-]/g, ' ');
  const words = plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’.\-]*/gu) ?? [];
  counts.push(words.length);
  if (words.length < 400) issues.push(`${file}: yalnızca ${words.length} gövde kelimesi`);

  const urls = [...body.matchAll(/https?:\/\/[^\s)\]>"']+/gi)].map((match) => match[0]);
  const hosts = urls.map((url) => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } }).filter(Boolean);
  if (!hosts.length) issues.push(`${file}: dış kaynak bağlantısı yok`);
  if (!hosts.some((host) => officialHosts.some((official) => host === official || host.endsWith(`.${official}`)))) issues.push(`${file}: tanınan resmî/kurumsal kaynak yok`);

  const internal = [...body.matchAll(/\]\(\/(?:avrupagazetesi\/)?makale\/([^)#?]+)[^)]*\)/g)].map((match) => match[1].replace(/\/$/, ''));
  if (!internal.length) issues.push(`${file}: bağlamsal iç bağlantı yok`);
  for (const target of internal) if (!slugs.has(target)) issues.push(`${file}: kırık iç bağlantı ${target}`);

  for (const key of ['heroImage', 'heroAlt', 'heroCredit', 'heroCreditUrl']) if (!String(data[key] ?? '').trim()) issues.push(`${file}: ${key} eksik`);
  const hero = String(data.heroImage ?? '');
  if (hero.startsWith('/') && !fs.existsSync(path.join(root, 'public', hero))) issues.push(`${file}: hero dosyası bulunamadı ${hero}`);
  heroUse.set(hero, (heroUse.get(hero) ?? 0) + 1);
  for (const pattern of filler) if (pattern.test(body)) issues.push(`${file}: şablon/AI dolgu ifadesi ${pattern}`);
}

const sorted = [...counts].sort((a, b) => a - b);
console.log(JSON.stringify({
  articles: files.length,
  minimumWords: sorted[0] ?? 0,
  medianWords: sorted[Math.floor(sorted.length / 2)] ?? 0,
  maximumWords: sorted.at(-1) ?? 0,
  distinctHeroImages: [...heroUse.keys()].filter(Boolean).length,
  issues: issues.length,
}, null, 2));
if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('Editorial audit passed.');
