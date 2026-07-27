require('dotenv').config();
const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('http://localhost:4000/classes/6a570b2113e22029b8033cf4/sessions?limit=100', {
      headers: {
        // Need a valid token or just ignore if auth is disabled in dev
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
