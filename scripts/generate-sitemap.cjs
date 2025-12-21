"use strict";

/**
 * Build-time sitemap generator.
 *
 * - Computes lastmod per URL from the source page file mtime (fallback: build time)
 * - Excludes non-public/private/transitional routes (e.g., /login, /auth, /admin, /mypage, /payment, /dev, /error, /loading)
 * - Includes missing public routes such as /result
 * - Writes to public/sitemap.xml
 *
 * Configure site URL with SITE_URL env; defaults to production URL.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const srcPagesDir = path.join(projectRoot, "src", "pages");
const publicDir = path.join(projectRoot, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");
const siteUrl = process.env.SITE_URL || "https://ipzy.vercel.app";
const buildTime = new Date();

/**
 * Define public routes to include in sitemap.
 * Map route -> probable source file used to derive lastmod (best-effort).
 */
const routes = [
  { path: "/", file: "Home.tsx", priority: 1.0, changefreq: "weekly" },
  { path: "/quiz", file: "Quiz.tsx", priority: 0.9, changefreq: "weekly" },
  { path: "/pricing", file: "Pricing.tsx", priority: 0.8, changefreq: "monthly" },
  // Result is a shareable page (QuizRequiredRoute in-app), but requested to be listed.
  { path: "/result", file: "Result.tsx", priority: 0.7, changefreq: "weekly" },
];

/**
 * Get ISO8601 datetime (W3C datetime) for sitemap <lastmod>.
 */
function toW3CDate(date) {
  return date.toISOString();
}

/**
 * Resolve lastmod based on source file mtime or fallback to build time.
 */
function getLastModFromFile(fileName) {
  if (!fileName) return toW3CDate(buildTime);
  const candidate = path.join(srcPagesDir, fileName);
  try {
    const stat = fs.statSync(candidate);
    return toW3CDate(stat.mtime);
  } catch {
    // Fallback to build time if the file is not found or inaccessible
    return toW3CDate(buildTime);
  }
}

/**
 * Generate XML contents.
 */
function generateXml() {
  const urls = routes.map(({ path: routePath, file, priority, changefreq }) => {
    const loc = new URL(routePath.replace(/^\//, ""), siteUrl);
    const lastmod = getLastModFromFile(file);
    const priorityStr = typeof priority === "number" ? priority.toFixed(1) : "0.5";
    const changefreqTag = changefreq ? `<changefreq>${changefreq}</changefreq>` : "";

    return [
      "  <url>",
      `    <loc>${loc.href}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      changefreqTag && `    ${changefreqTag}`,
      `    <priority>${priorityStr}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  });

  const header = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <!-- Generated at build time: ${buildTime.toISOString()} -->`,
    "  <!-- Intentionally omitted: /login, /auth/*, /admin/*, /mypage/*, /payment/*, /dev/*, /error/*, /loading -->",
  ].join("\n");

  const footer = "</urlset>\n";
  return [header, ...urls, footer].join("\n");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  ensureDir(publicDir);
  const xml = generateXml();
  fs.writeFileSync(sitemapPath, xml, "utf8");
  // Log a short success note for CI visibility
  process.stdout.write(`Sitemap generated: ${path.relative(projectRoot, sitemapPath)}\n`);
}

main();
