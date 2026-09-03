#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'src', 'content', 'articles');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.md')).sort();
const stop = new Set(['avrupa', 'ab', 'rehberi', 'icin', 'ile', 've', 'bir', 'nasil', 'turkiye', '2026']);
const normalize = (text) => text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9çğıöşü]+/g, ' ');
const tokenize = (text) => new Set(normalize(text).split(/\s+/).filter((word) => word.length > 2 && !stop.has(word)));
const articles = files.map((file) => {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const title = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? file;
  const section = raw.match(/^section:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? '';
  return { filePath, raw, title, section, slug: file.replace(/\.md$/i, ''), tokens: tokenize(title) };
});
const prefixes = ['vize', 'oturum', 'vatandas', 'kira', 'vergi', 'saglik', 'sigorta', 'tuketici', 'gdpr', 'ucus', 'aile', 'calisma', 'emeklilik', 'almanya', 'fransa', 'belcika', 'avusturya'];
function score(a, b) {
  let value = a.section === b.section ? 1 : 0;
  for (const token of a.tokens) if (b.tokens.has(token)) value += token.length >= 6 ? 3 : 2;
  for (const prefix of prefixes) if (a.slug.includes(prefix) && b.slug.includes(prefix)) value += 8;
  return value;
}
const lead = {
  'goc-ve-uyum': 'Göç ve uyum dosyanızdaki bağlantılı adımları tamamlamak için',
  toplum: 'Topluluk ve aile planınızdaki bağlantılı adımları tamamlamak için',
  'turkiye-avrupa': 'Türkiye ile Avrupa arasındaki belge zincirini birlikte planlamak için',
  yasam: 'Günlük yaşam dosyanızdaki bağlantılı adımları tamamlamak için',
  rehber: 'Bu işlemin bağlantılı belge ve doğrulama adımlarını görmek için',
};
let changed = 0;
for (const article of articles) {
  if (/\]\(\/avrupagazetesi\/makale\//.test(article.raw)) continue;
  const related = articles.filter((candidate) => candidate.slug !== article.slug).map((candidate) => ({ candidate, score: score(article, candidate) })).sort((a, b) => b.score - a.score || a.candidate.slug.localeCompare(b.candidate.slug, 'tr'))[0]?.candidate;
  if (!related) throw new Error(`İlgili yazı bulunamadı: ${article.slug}`);
  const paragraph = `\n\n## İlgili okuma\n\n${lead[article.section] ?? lead.rehber}, [${related.title}](/avrupagazetesi/makale/${related.slug}/) yazısındaki kontrol sırasını da inceleyin. İki rehberi tek dosyada izlemek, tekrar belge toplama ve çelişen işlem adımları riskini azaltır.\n`;
  fs.writeFileSync(article.filePath, article.raw.trimEnd() + paragraph);
  changed += 1;
}
console.log(`${changed} yazıya konu yakınlığına göre bağlamsal iç bağlantı eklendi.`);
