const https = require('https');
const http = require('http');

const url = 'https://storage.art-ai-system.com/submissions/swd392_st1.zip';

console.log('Testing download of:', url);
const req = https.get(url, (res) => {
  console.log('Response statusCode:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let size = 0;
  res.on('data', (chunk) => {
    size += chunk.length;
  });
  
  res.on('end', () => {
    console.log('Finished reading response. Size of data:', size);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});
