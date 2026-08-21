import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
async function walk(dir) { const out=[]; for(const name of await readdir(dir)){const p=join(dir,name); (await stat(p)).isDirectory()?out.push(...await walk(p)):out.push(p);} return out; }
const files=await walk('dist');
const html=files.filter((x)=>x.endsWith('.html'));
const failures=[];
for(const file of html){const body=await readFile(file,'utf8'); for(const [label,pattern] of [['title',/<title>[^<]{8,}<\/title>/],['description',/<meta name="description" content="[^"]{40,}"/],['canonical',/<link rel="canonical" href="https:\/\//],['h1',/<h1[ >]/],['json-ld',/application\/ld\+json/]]) if(!pattern.test(body)) failures.push(`${file}: missing ${label}`);}
for(const required of ['rss.xml','llms.txt','robots.txt','sitemap-index.xml']) if(!files.some((x)=>x.replaceAll('\\','/').endsWith(`/${required}`))) failures.push(`dist: missing ${required}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1);} console.log(`SEO check passed for ${html.length} HTML pages.`);
