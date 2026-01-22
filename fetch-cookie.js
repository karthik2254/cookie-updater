const axios = require('axios');
const fs = require('fs');

// 🔒 URL hidden & controlled via environment variable
const url = process.env.HIDDEN_API_URL;

if (!url) {
  console.error('❌ HIDDEN_API_URL is not set');
  process.exit(1);
}

axios.get(url)
  .then(response => {
    const data = response.data;

    if (!Array.isArray(data)) {
      console.error('❌ Expected JSON array from API.');
      process.exit(1);
    }

    if (!data[0] || !data[0].cookie) {
      console.error('❌ Cookie not found');
      process.exit(1);
    }

    let cookie = data[0].cookie;

    // Remove "__hdnea__=" if already exists
    if (cookie.startsWith('__hdnea__=')) {
      cookie = cookie.replace('__hdnea__=', '');
    }

    const formatted = {
      cookieHeader: `__hdnea__=${cookie}`
    };

    fs.writeFileSync(
      'cookie.json',
      JSON.stringify(formatted, null, 2),
      'utf8'
    );

    console.log('✅ cookie.json updated successfully');
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
