#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleDir = path.join(root, 'src', 'content', 'articles');
const imageDir = path.join(root, 'public', 'images', 'editorial');
const assets = {
  'airplane-flight.jpg': ['1660194', 'Dan Gold', 'Uçak penceresinden görünen bulutlar ve dağlar'],
  'baby-travel.jpg': ['4173222', 'Gustavo Fring', 'Havalimanında valiziyle seyahat eden anne ve çocuğu'],
  'business-meeting.jpg': ['1181406', 'Christina Morillo', 'Toplantı masasında çalışan profesyoneller'],
  'cargo-containers.jpg': ['906494', 'Chanaka E', 'Liman sahasında üst üste dizilmiş yük konteynerleri'],
  'classroom-education.jpg': ['8363102', 'Yan Krukau', 'Sınıfta öğretmenleriyle çalışan öğrenciler'],
  'community-diverse.jpg': ['4143429', 'Andrea Piacquadio', 'Bir araya gelen farklı yaş ve kökenlerden insanlar'],
  'community-gathering-dinner.jpg': ['5774929', 'fauxels', 'Birlikte yemek yiyen topluluk üyeleri'],
  'community-hands.jpg': ['9630217', 'Ivan Samkov', 'Dayanışmayı simgeleyen birleşmiş eller'],
  'courthouse-justice.jpg': ['5668882', 'Sora Shimazaki', 'Adliye binası ve adalet sütunları'],
  'credit-score.jpg': ['4968390', 'Mikhail Nilov', 'Bilgisayar başında banka kartını kontrol eden kişi'],
  'family-multicultural.jpg': ['6393334', 'William Fortunato', 'Evde birlikte vakit geçiren çok kültürlü aile'],
  'health-insurance.jpg': ['4989132', 'MART PRODUCTION', 'Hasta dosyasını inceleyen sağlık çalışanı'],
  'highway-traffic.jpg': ['221284', 'Pixabay', 'Çok şeritli otoyolda ilerleyen otomobil ve kamyonlar'],
  'home-buying.jpg': ['7642008', 'Kampus Production', 'Yeni evin anahtarını teslim alan kişi'],
  'hospital-doctor.jpg': ['5998477', 'MART PRODUCTION', 'Stetoskoplu bir hastane doktoru'],
  'identity-culture.jpg': ['8828605', 'Lara Jameson', 'Dünya haritası üzerinde farklı ülkelerin bayrakları'],
  'newspaper-press.jpg': ['5505690', 'Gül Işık', 'Masa üzerinde katlanmış basılı gazeteler'],
  'passport-visa.jpg': ['7009478', 'RDNE Stock project', 'Elinde farklı ülkelere ait pasaportlar tutan kişi'],
  'pet-air-travel.jpg': ['18723811', 'Jeswin Thomas', 'Havalimanı terminalinde bekleyen eğitimli yardımcı köpek'],
  'pharmacy-medicine.jpg': ['8657301', 'cottonbro studio', 'Eczane rafından ilaç seçen eczacı'],
  'policy-document.jpg': ['48148', 'Pixabay', 'Resmî bir belgeyi imzalayan kişi'],
  'power-lines.jpg': ['15402743', 'Rossea Vlyn', 'Gökyüzü önünde elektrik direği ve enerji hatları'],
  'professional-networking.jpg': ['1181406', 'Christina Morillo', 'Konferans salonunda fikir alışverişi yapan profesyoneller'],
  'remote-work.jpg': ['3791130', 'Andrea Piacquadio', 'Dizüstü bilgisayarla çalışan bir profesyonel'],
  'retirement-planning.jpg': ['3943715', 'Joslyn Pickens', 'Kumbaraya para atarak birikim yapan kişi'],
  'small-business.jpg': ['7413915', 'RDNE Stock project', 'Küçük işletme planını görüşen girişimciler'],
  'tax-documents.jpg': ['6863330', 'RDNE Stock project', 'Vergi belgelerini düzenleyen bir kişi'],
  'university-campus.jpg': ['7683694', 'Tima Miroshnichenko', 'Üniversite kampüsünde yürüyen öğrenciler'],
  'volunteer-community-service.jpg': ['6647007', 'RDNE Stock project', 'Kamusal alanı birlikte temizleyen gönüllüler'],
};
const groups = [
  [/evcil hayvan|kedi|köpek|pet passport/i, ['pet-air-travel.jpg']],
  [/uçuş|havayolu|havalimanı|yolcu|bagaj|seyahat|roaming/i, ['airplane-flight.jpg', 'baby-travel.jpg', 'passport-visa.jpg']],
  [/ithalat|ihracat|gümrük|nakit beyan|ticaret|kargo|kdv iade/i, ['cargo-containers.jpg', 'business-meeting.jpg', 'policy-document.jpg']],
  [/vize|göç|oturum|vatandaşlık|pasaport|mavi kart|aile birleşimi|chancenkarte|single permit/i, ['passport-visa.jpg', 'policy-document.jpg', 'identity-culture.jpg']],
  [/vergi|sepa|iban|banka|kredi|borç|ödeme|mevduat|finans|euro|atm/i, ['tax-documents.jpg', 'credit-score.jpg', 'retirement-planning.jpg']],
  [/emeklilik|pension|sigorta primi|sosyal güvenlik/i, ['retirement-planning.jpg', 'tax-documents.jpg']],
  [/sağlık|hastane|doktor|ehic|e-card|tedavi|eczane|ilaç|engelli/i, ['hospital-doctor.jpg', 'health-insurance.jpg', 'pharmacy-medicine.jpg']],
  [/okul|öğrenci|eğitim|diploma|üniversite|araştırmacı|denklik|meslek/i, ['classroom-education.jpg', 'university-campus.jpg', 'professional-networking.jpg']],
  [/kira|kiracı|konut|ev satın|mortgage|emlak|depozito|adres kaydı|anmeldung|meldezettel/i, ['home-buying.jpg', 'policy-document.jpg']],
  [/ehliyet|araç|otomobil|trafik|otobüs|tren|park kartı/i, ['highway-traffic.jpg', 'airplane-flight.jpg']],
  [/iş arama|işveren|çalışan|çalışma|kariyer|şirket|platform çalışanı|au pair/i, ['professional-networking.jpg', 'business-meeting.jpg', 'small-business.jpg', 'remote-work.jpg']],
  [/mahkeme|hukuk|dava|şikâyet|ayrımcılık|ombudsman|tüketici|gdpr|dsa|polis|koruma kararı/i, ['courthouse-justice.jpg', 'policy-document.jpg', 'community-hands.jpg']],
  [/çocuk|aile|doğum|evlilik|boşanma|bakım|miras|ölüm/i, ['family-multicultural.jpg', 'baby-travel.jpg', 'policy-document.jpg']],
  [/topluluk|diaspora|dernek|kültür|Türkçe|gönüllü|seçim|dilekçe/i, ['community-diverse.jpg', 'identity-culture.jpg', 'community-gathering-dinner.jpg', 'volunteer-community-service.jpg']],
  [/enerji|elektrik|batarya|çevre|etiket|tamir/i, ['power-lines.jpg', 'policy-document.jpg']],
  [/gazete|medya|haber/i, ['newspaper-press.jpg']],
];
const fallback = {
  'goc-ve-uyum': ['passport-visa.jpg', 'identity-culture.jpg', 'policy-document.jpg'],
  toplum: ['community-diverse.jpg', 'community-hands.jpg', 'family-multicultural.jpg'],
  'turkiye-avrupa': ['identity-culture.jpg', 'business-meeting.jpg', 'cargo-containers.jpg'],
  yasam: ['home-buying.jpg', 'remote-work.jpg', 'community-diverse.jpg'],
  rehber: ['policy-document.jpg', 'remote-work.jpg', 'professional-networking.jpg'],
};

function readFields(raw) {
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
function setFields(filePath, updates) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Frontmatter bulunamadı: ${filePath}`);
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let lines = match[1].split(/\r?\n/);
  for (const [key, value] of Object.entries(updates)) {
    const index = lines.findIndex((line) => line.startsWith(`${key}:`));
    lines = lines.filter((line) => !line.startsWith(`${key}:`));
    lines.splice(index >= 0 ? Math.min(index, lines.length) : lines.length, 0, `${key}: ${JSON.stringify(value)}`);
  }
  fs.writeFileSync(filePath, raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---${eol}${lines.join(eol)}${eol}---`));
}
function stableIndex(text, length) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash % length;
}

const usage = new Map();
for (const file of fs.readdirSync(articleDir).filter((name) => name.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/i, '');
  const filePath = path.join(articleDir, file);
  const data = readFields(fs.readFileSync(filePath, 'utf8'));
  const choices = groups.find(([pattern]) => pattern.test(String(data.title ?? slug)))?.[1] ?? fallback[data.section] ?? fallback.rehber;
  const image = choices[stableIndex(slug, choices.length)];
  const [id, author, alt] = assets[image];
  if (!fs.existsSync(path.join(imageDir, image))) throw new Error(`Görsel bulunamadı: ${image}`);
  setFields(filePath, { heroImage: `/images/editorial/${image}`, heroAlt: alt, heroCredit: `${author} / Pexels`, heroCreditUrl: `https://www.pexels.com/photo/${id}/` });
  usage.set(image, (usage.get(image) ?? 0) + 1);
}
console.log(`200 yazıya konu eşleşmeli editör onaylı fotoğraf atandı.`);
console.log([...usage].sort((a, b) => b[1] - a[1]).map(([name, count]) => `${count}\t${name}`).join('\n'));
