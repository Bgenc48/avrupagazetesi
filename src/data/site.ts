export const site = {
  name: 'Avrupa Gazetesi',
  description: "Avrupa'daki Türk toplumu için göç, yaşam, toplum ve Türkiye–Avrupa haberleri.",
  locale: 'tr_DE',
  sections: [
    { slug: 'goc-ve-uyum', label: 'Göç ve Uyum', description: 'Avrupa’da oturum, vatandaşlık, dil ve uyum süreçlerine ilişkin doğrulanmış bilgiler' },
    { slug: 'toplum', label: 'Toplum', description: 'Avrupa Türk toplumundan gelişmeler, kurumlar, kültür ve kuşaklar arası yaşam' },
    { slug: 'turkiye-avrupa', label: 'Türkiye–Avrupa', description: 'Türkiye ile Avrupa arasındaki siyaset, ekonomi, diplomasi ve toplum ilişkileri' },
    { slug: 'yasam', label: 'Yaşam', description: 'Avrupa’da çalışma, eğitim, aile, sağlık, kültür ve gündelik hayata dair dosyalar' },
    { slug: 'rehber', label: 'Rehber', description: 'Kamu hizmetleri ve günlük işlemler için kaynaklı, uygulanabilir adım adım rehberler' },
  ],
} as const;

export function href(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
