const axios = require('axios');
const fs = require('fs');

const url = process.env.COOKIE_API_URL; // 🔒 secured

if (!url) {
  console.error('COOKIE_API_URL is not defined');
  process.exit(1);
}

axios.get(url, {
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json'
  }
})
.then(response => {
  const data = response.data;

  if (!Array.isArray(data)) {
    console.error('Expected JSON array from API.');
    process.exit(1);
  }

  let cookie = data[0].cookie || '';

  if (cookie.startsWith('__hdnea__=')) {
    cookie = cookie.replace('__hdnea__=', '');
  }

  const formatted = {
    cookieHeader: `__hdnea__=${cookie}`
  };

  fs.writeFileSync('cookie.json', JSON.stringify(formatted, null, 2));
  console.log('cookie.json updated successfully');
})
.catch(error => {
  console.error('Error fetching or writing data:', error.message);
  process.exit(1);
});
