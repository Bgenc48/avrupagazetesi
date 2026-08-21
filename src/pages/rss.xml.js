import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  const articles=(await getCollection('articles')).sort((a,b)=>b.data.pubDate.valueOf()-a.data.pubDate.valueOf());
  return rss({title:'Avrupa Gazetesi',description:"Avrupa'daki Türk toplumu için haber ve rehberler",site:context.site,customData:'<language>tr-TR</language>',items:articles.map((a)=>({title:a.data.title,description:a.data.excerpt,pubDate:a.data.pubDate,link:`makale/${a.id}`}))});
}
