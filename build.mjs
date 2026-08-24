import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

const site = {
  name: 'MUSE MARINE',
  url: 'https://musemarine.com',
  email: 'info@musemarine.com',
  salesEmail: 'sales@musemarine.com',
  supportEmail: 'support@musemarine.com',
  formEndpoint: 'https://api.web3forms.com/submit',
  web3formsKey: '216f5ebd-b045-4bee-b6c4-6059987b6dc9',
  phone: '+1 (555) 123-4567',
  address: '123 Harbor Way, Port City',
  ogImage: 'https://musemarine.com/assets/images/hero-1.jpg',
};

const pages = {
  'index.html': {
    title: 'Premium Marine Batteries & Electronics | MUSE MARINE',
    description: 'MUSE MARINE is a leading provider of high-performance marine industrial small batteries and ship electronics. Explore our reliable maritime power solutions.',
    keywords: 'marine battery, ship electronics, marine equipment, IMPA marine products, MUSE MARINE',
    active: 'index',
  },
  'about.html': {
    title: 'About MUSE MARINE | Leading Ship Battery Manufacturer',
    description: "Discover MUSE MARINE's legacy in engineering high-reliability marine small batteries, shipboard electronics, and IMPA compliant power solutions globally.",
    keywords: 'about MUSE MARINE, marine battery manufacturer, shipboard battery legacy, maritime power equipment, IMPA compliance',
    active: 'about',
  },
  'products.html': {
    title: 'Marine Industrial Batteries & Ship Electronics | MUSE MARINE',
    description: "Explore MUSE MARINE's 50+ marine industrial battery SKUs - Li-SOCl2 cells, PLC memory backup batteries, coin cells, rechargeable packs, lifeboat chargers and shipboard accessories. IMPA certified.",
    keywords: 'marine battery, PLC backup battery, Li-SOCl2, LS14500, lifeboat charger, coin cell, ship electronics, IMPA marine products, MUSE MARINE',
    active: 'products',
  },
  'cases.html': {
    title: 'Global Marine Power & Electronics Cases | MUSE MARINE',
    description: 'Discover how global fleet owners and shipyards deploy MUSE MARINE small industrial batteries and electronics for flawless, highly certified maritime operations.',
    keywords: 'marine battery cases, shipowner power system reviews, vessel electronics applications, ship emergency backup power testimonials, MUSE MARINE',
    active: 'cases',
  },
  'services.html': {
    title: 'Marine Battery Service & Support | MUSE MARINE',
    description: 'Get professional technical support, SDS manuals, and maintenance services for MUSE MARINE small industrial ship batteries and marine electronics.',
    keywords: 'marine battery service, ship battery maintenance, marine electronics support, IMPA battery MSDS, MUSE MARINE',
    active: 'services',
  },
  'news.html': {
    title: 'Marine Battery & Shipping Industry News | MUSE MARINE',
    description: 'Stay updated with the latest trends in marine industrial batteries, vessel electronics, UN38.3 shipping compliance, and IMPA trade regulations from MUSE MARINE.',
    keywords: 'marine battery news, ship electronics trends, maritime export regulations, UN38.3 marine shipping, IMPA class 17, MUSE MARINE',
    active: 'news',
  },
  'contact.html': {
    title: 'Contact MUSE MARINE | Global Ship Battery Inquiry & Quotes',
    description: 'Get in touch with MUSE MARINE for high-quality marine small batteries, IMPA ship electronics, custom industrial power supplies, and international export quotes.',
    keywords: 'contact MUSE MARINE, marine battery RFQ, IMPA 170101 procurement, ship battery inquiry, maritime trade support',
    active: 'contact',
  },
  'privacy.html': {
    title: 'Privacy Policy | MUSE MARINE',
    description: 'Privacy policy for MUSE MARINE.',
    keywords: 'privacy policy, MUSE MARINE',
    active: null,
  },
  'terms.html': {
    title: 'Terms of Service | MUSE MARINE',
    description: 'Terms of service for MUSE MARINE.',
    keywords: 'terms of service, MUSE MARINE',
    active: null,
  },
};

const navItems = ['INDEX', 'ABOUT', 'PRODUCTS', 'CASES', 'SERVICES', 'NEWS', 'CONTACT'];

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const head = read('_partials/head.html');
const nav = read('_partials/nav.html');
const footer = read('_partials/footer.html');
const scripts = read('_partials/scripts.html');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

for (const [file, meta] of Object.entries(pages)) {
  const body = read('pages/' + file);
  const canonical = file === 'index.html' ? site.url + '/' : site.url + '/' + file;
  let out = head + nav + body + footer + scripts;

  out = out
    .replaceAll('{{SITE_NAME}}', site.name)
    .replaceAll('{{SITE_URL}}', site.url)
    .replaceAll('{{SITE_EMAIL}}', site.email)
    .replaceAll('{{SALES_EMAIL}}', site.salesEmail)
    .replaceAll('{{SUPPORT_EMAIL}}', site.supportEmail)
    .replaceAll('{{FORM_ENDPOINT}}', site.formEndpoint)
    .replaceAll('{{WEB3FORMS_KEY}}', site.web3formsKey)
    .replaceAll('{{SITE_PHONE}}', site.phone)
    .replaceAll('{{SITE_ADDRESS}}', site.address)
    .replaceAll('{{OG_IMAGE}}', site.ogImage)
    .replaceAll('{{TITLE}}', meta.title)
    .replaceAll('{{DESCRIPTION}}', meta.description)
    .replaceAll('{{KEYWORDS}}', meta.keywords)
    .replaceAll('{{CANONICAL}}', canonical);

  for (const item of navItems) {
    const active = meta.active === item.toLowerCase();
    out = out
      .replaceAll('{{NAV_' + item + '}}', active ? 'text-appleDark font-medium hover:text-appleBlue' : 'text-appleMuted hover:text-appleBlue')
      .replaceAll('{{NAV_' + item + '_M}}', active ? 'text-appleDark bg-gray-50' : 'text-appleMuted hover:bg-gray-50');
  }

  fs.writeFileSync(path.join(DIST, file), out, 'utf8');
}

// Recursively copy src/assets (including images/) into dist/assets
const copyDir = (srcDir, distDir) => {
  fs.mkdirSync(distDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, f);
    const d = path.join(distDir, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
};
copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));

fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + site.url + '/sitemap.xml\n',
  'utf8',
);

const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
for (const file of Object.keys(pages)) {
  const loc = file === 'index.html' ? site.url + '/' : site.url + '/' + file;
  sitemap.push('  <url><loc>' + loc + '</loc><lastmod>2026-08-24</lastmod></url>');
}
sitemap.push('</urlset>');
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap.join('\n') + '\n', 'utf8');

console.log('Built ' + Object.keys(pages).length + ' pages into dist/');
