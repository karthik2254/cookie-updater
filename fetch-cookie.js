const axios = require('axios');
const fs = require('fs');

const url = process.env.COOKIE_API_URL;

if (!url) {
  console.error('COOKIE_API_URL not set');
  process.exit(1);
}

axios.get(url)
  .then(res => {
    if (!Array.isArray(res.data)) {
      throw new Error('Invalid API response');
    }

    let cookie = res.data[0].cookie || '';
    if (cookie.startsWith('__hdnea__=')) {
      cookie = cookie.replace('__hdnea__=', '');
    }

    const output = {
      cookieHeader: `__hdnea__=${cookie}`
    };

    fs.writeFileSync('cookie.json', JSON.stringify(output, null, 2));
    console.log('cookie.json updated');
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
