export function GET({ site }) {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/avrupagazetesi/sitemap-index.xml',site)}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
