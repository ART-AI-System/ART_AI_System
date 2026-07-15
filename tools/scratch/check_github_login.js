const { spawnSync } = require('child_process');
const https = require('https');

const gitProc = spawnSync('git', ['credential', 'fill'], {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: 'utf-8'
});

if (gitProc.error) {
  console.log("Error running git credential:", gitProc.error);
  process.exit(1);
}

const output = gitProc.stdout;
const match = output.match(/password=(.+)/);
if (!match) {
  console.log("NO_CREDENTIAL");
  process.exit(0);
}

const token = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'Node.js'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.login) {
        console.log(`LOGGED_IN_AS: ${json.login}`);
      } else {
        console.log("API_ERROR: ", json);
      }
    } catch (e) {
      console.log("PARSE_ERROR: ", data);
    }
  });
});

req.on('error', e => console.error(e));
req.end();
