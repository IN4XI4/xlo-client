#!/usr/bin/env node
/* eslint-env node */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { assessmentUrl } from '../src/utils/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://mixelo.io';
const OUTPUT_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const PAGE_SIZE = 100;

function readApiBaseUrl() {
  if (process.env.VITE_API_BASE_URL) return process.env.VITE_API_BASE_URL;
  const envFile = path.join(ROOT, '.env.production');
  if (existsSync(envFile)) {
    const match = readFileSync(envFile, 'utf-8').match(/^VITE_API_BASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  }
  return 'https://api.mixelo.io/';
}

async function fetchAllPages(apiBaseUrl, path) {
  const items = [];
  let url = `${apiBaseUrl}${path}${path.includes('?') ? '&' : '?'}page_size=${PAGE_SIZE}`;
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
    const data = await res.json();
    items.push(...(data.results || []));
    url = data.next;
  }
  return items;
}

async function fetchAllActiveAssessments(apiBaseUrl) {
  const assessments = await fetchAllPages(apiBaseUrl, 'assessments/assessments/');
  return assessments.filter((assessment) => assessment.is_active);
}

async function fetchAllPublicStories(apiBaseUrl) {
  const stories = await fetchAllPages(apiBaseUrl, 'blog/stories/');
  return stories.filter((story) => story.is_active && !story.is_private);
}

async function fetchAllTopics(apiBaseUrl) {
  const topicTags = await fetchAllPages(apiBaseUrl, 'base/topictags/');
  const topicsBySlug = new Map();
  for (const topicTag of topicTags) {
    for (const topic of topicTag.topics || []) {
      topicsBySlug.set(topic.slug, topic);
    }
  }
  return [...topicsBySlug.values()];
}

function buildSitemap(assessments, topics, stories) {
  const staticUrls = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/assessments', changefreq: 'daily', priority: '0.9' },
    { loc: '/rankings', changefreq: 'daily', priority: '0.7' },
  ];

  const assessmentUrls = assessments.map((assessment) => ({
    loc: assessmentUrl(assessment),
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const topicUrls = topics.map((topic) => ({
    loc: `/topic/${topic.slug}`,
    changefreq: 'yearly',
    priority: '0.5',
  }));

  const storyUrls = stories.map((story) => ({
    loc: `/story/${story.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const entries = [...staticUrls, ...assessmentUrls, ...topicUrls, ...storyUrls]
    .map(({ loc, changefreq, priority }) =>
      `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

async function main() {
  const apiBaseUrl = readApiBaseUrl();
  try {
    const [assessments, topics, stories] = await Promise.all([
      fetchAllActiveAssessments(apiBaseUrl),
      fetchAllTopics(apiBaseUrl),
      fetchAllPublicStories(apiBaseUrl),
    ]);
    const xml = buildSitemap(assessments, topics, stories);
    writeFileSync(OUTPUT_PATH, xml);
    console.log(`sitemap.xml generated with ${assessments.length} assessment(s), ${topics.length} topic(s), and ${stories.length} stor(y/ies) from ${apiBaseUrl}`);
  } catch (error) {
    console.warn(`Skipping sitemap regeneration, keeping existing public/sitemap.xml. Reason: ${error.message}`);
  }
}

main();
