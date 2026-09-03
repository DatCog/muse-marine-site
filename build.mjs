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
    title: 'Marine Industrial Batteries & GMDSS Safety Cells | MUSE MARINE',
    description: 'MUSE MARINE supplies GMDSS safety batteries (EPIRB, SART, VDR), industrial Li-SOCl2 cells and PLC backup batteries for global fleets. IMPA & SOLAS compliant marine power solutions.',
    keywords: 'marine battery, GMDSS battery, EPIRB battery, PLC backup battery, Li-SOCl2, ship electronics, IMPA marine products, MUSE MARINE',
    active: 'index',
  },
  'about.html': {
    title: 'About MUSE MARINE | Specialist Marine Battery Supplier',
    description: "MUSE MARINE sources and supplies industrial small batteries and GMDSS safety cells for chandlers, ship managers and fleet buyers — IMPA code-matched with UN38.3 and MSDS documentation.",
    keywords: 'about MUSE MARINE, marine battery supplier, GMDSS battery sourcing, IMPA code match, maritime power equipment',
    active: 'about',
  },
  'products.html': {
    title: 'Marine Industrial Batteries & GMDSS Safety Cells | MUSE MARINE',
    description: "Explore MUSE MARINE's 70+ marine industrial battery SKUs - GMDSS safety batteries (EPIRB, SART, VDR), Li-SOCl2 cells, PLC memory backup batteries, coin cells, cylindrical lithium and rechargeable packs. IMPA code-matched.",
    keywords: 'marine battery, GMDSS battery, EPIRB battery, SART battery, PLC backup battery, Li-SOCl2, ER14505, coin cell, cylindrical lithium, ship electronics, IMPA marine products, MUSE MARINE',
    active: 'products',
  },
  'cases.html': {
    title: 'Marine Battery Applications & Use Cases | MUSE MARINE',
    description: 'The scenarios MUSE MARINE supplies for — GMDSS safety batteries (EPIRB, SART, VDR), PLC backup, Li-SOCl2, coin and cylindrical cells — matched to IMPA codes with UN38.3 and MSDS documentation.',
    keywords: 'GMDSS battery replacement, EPIRB battery, SART battery, PLC backup battery, Li-SOCl2 cell, marine battery applications, IMPA code match, MUSE MARINE',
    active: 'cases',
  },
  'services.html': {
    title: 'Marine Battery Documentation & Logistics | MUSE MARINE',
    description: 'UN38.3 test summaries, MSDS sheets, IMPA code matching and small-batch air or ocean freight with DDP delivery for marine industrial batteries.',
    keywords: 'UN38.3 marine battery, MSDS marine battery, IMPA code match, dangerous goods freight, DDP marine battery delivery, MUSE MARINE',
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
