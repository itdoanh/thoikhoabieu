import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchGoogle(query) {
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    // Google search result selectors
    $('div.g').each((i, el) => {
      if (results.length >= 10) return false;

      const titleEl = $(el).find('h3').first();
      const linkEl = $(el).find('a').first();
      const snippetEl = $(el).find('.VwiC3b, .yXK7lf').first();

      const title = titleEl.text().trim();
      const link = linkEl.attr('href');
      const snippet = snippetEl.text().trim();

      if (title && link && link.startsWith('http')) {
        results.push({ title, url: link, snippet });
      }
    });

    return results;
  } catch (error) {
    console.error('Search error:', error.message);
    return [];
  }
}

const query = process.argv.slice(2).join(' ');
if (!query) {
  console.error('Usage: node search.js <query>');
  process.exit(1);
}

searchGoogle(query).then(results => {
  if (results.length === 0) {
    console.log('No results found. Try a different query.');
    return;
  }

  console.log(`Found ${results.length} results:\n`);
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.title}`);
    console.log(`   URL: ${r.url}`);
    if (r.snippet) console.log(`   ${r.snippet.substring(0, 120)}...`);
    console.log('');
  });
});
