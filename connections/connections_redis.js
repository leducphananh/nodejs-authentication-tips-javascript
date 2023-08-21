const redis = require('redis');

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379',
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error(err.message);
});

client.on('ready', () => {
  console.log('Redis is ready');
});

client.on('end', () => {
  console.log('Redis connection ended');
});

process.on('SIGINT', () => {
  client.quit();
});

client
  .connect()
  .then(() => {
    console.log('Connected to Redis');
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = client;
