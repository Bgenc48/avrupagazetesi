import { getCollection } from 'astro:content';
export async function GET({ site }) {
  const base=new URL('/avrupagazetesi/',site);
  const articles=(await getCollection('articles')).sort((a,b)=>b.data.pubDate.valueOf()-a.data.pubDate.valueOf());
  const lines=['# Avrupa Gazetesi','',"Avrupa'daki Türk toplumu için bağımsız haber ve hizmet rehberleri.",'','## Ana bölümler','- Göç ve Uyum','- Toplum','- Türkiye–Avrupa','- Yaşam','- Rehber','','## İçerikler',...articles.map((a)=>`- [${a.data.title}](${new URL(`makale/${a.id}`,base)}) — ${a.data.excerpt}`),'','## Politikalar',`- [Hakkımızda](${new URL('hakkimizda',base)})`,`- [Yayın İlkeleri](${new URL('yayin-ilkeleri',base)})`];
  return new Response(lines.join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
