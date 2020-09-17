const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

// Redis documentation advises to work on duplicates
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// sub stands for subscription
// watch redis and get message every time new value shows up
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
