const axios = require('axios');
const fs = require('fs');

// 🔒 URL is hidden using GitHub Secret / Environment Variable
const url = process.env.HIDDEN_API_URL;

if (!url) {
  console.error('HIDDEN_API_URL not set');
  process.exit(1);
}

axios.get(url)
  .then(res => {
    const data = res.data;

    if (!Array.isArray(data)) {
      console.error('API response is not an array');
      process.exit(1);
    }

    if (!data[0] || !data[0].cookie) {
      console.error('Cookie not found');
      process.exit(1);
    }

    let cookie = data[0].cookie;

    // Remove existing prefix if present
    cookie = cookie.replace(/^(__hdnea__=|hdnea=)/, '');

    const output = {
      cookieHeader: `__hdnea__=${cookie}`
    };

    fs.writeFileSync(
      'cookie.json',
      JSON.stringify(output, null, 2),
      'utf8'
    );

    console.log('cookie.json updated successfully');
  })
  .catch(err => {
    console.error('Request failed:', err.message);
    process.exit(1);
  });
