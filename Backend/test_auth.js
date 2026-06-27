const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/accountant/dashboard-stats',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkRpcGFBY2NvdW50YW50QGdtYWlsLmNvbSIsImlkIjoxOCwicm9sZSI6IkFjY291bnRhbnQiLCJzY2hvb2xJZCI6MSwiaWF0IjoxNzgyNTQwODQ5LCJleHAiOjE3ODMxNDU2NDl9.jm0TqjEgom4wAALkIPCipfQtLm13d0Hd6JNMnbzifDk'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${data}`);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
