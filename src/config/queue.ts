export default {
  queueName: process.env.QUEUE_NAME || 'users_queue',
  url: process.env.RABBIT_URL || 'amqp://localhost:5672',
};
