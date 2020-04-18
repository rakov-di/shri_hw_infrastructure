const axios = require('axios').default;

axios.post('http://localhost:7000/notify-agent', {
  host: 'http://localhost',
  port: 8000
});
