import axios from 'axios';

async function searchNpm(keywords) {
  try {
    const url = `https://registry.npmjs.org/-/v1/search?text=${keywords}&size=20`;
    const { data } = await axios.get(url);

    return data.objects.map(obj => ({
      name: obj.package.name,
      description: obj.package.description || 'No description',
      version: obj.package.version,
      downloads: obj.downloads?.weekly || 0,
      keywords: obj.package.keywords || [],
      links: obj.package.links
    }));
  } catch (error) {
    console.error('NPM search error:', error.message);
    return [];
  }
}

const query = process.argv.slice(2).join(' ') || 'react schedule calendar drag drop';

console.log(`Searching NPM for: "${query}"\n`);

searchNpm(query).then(results => {
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.length} packages:\n`);
  results.slice(0, 10).forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} (v${r.version})`);
    console.log(`   ${r.description}`);
    console.log(`   Downloads: ${r.downloads.toLocaleString()}/week`);
    if (r.keywords.length > 0) {
      console.log(`   Keywords: ${r.keywords.slice(0, 5).join(', ')}`);
    }
    console.log('');
  });
});
