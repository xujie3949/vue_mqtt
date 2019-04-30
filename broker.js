const mosca = require('mosca');

const settings = {
  port: 1884,
  // backend: {
  //   type: 'zmq',
  //   json: false,
  //   zmq: require('zmq'),
  //   port: 'tcp://127.0.0.1:33333',
  //   controlPort: 'tcp://127.0.0.1:33334',
  //   delay: 5,
  // },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb',
  },
  http: {
    port: 3333,
    bundle: true,
    static: './',
  },
};

// here we start mosca
const server = new mosca.Server(settings);

server.on('ready', () => {
  console.log('Mosca server is up and running');
});

// fired when a client is connected
server.on('clientConnected', (client) => {
  console.log(`client ${client.id} connected`);
});

// fired when a message is received
server.on('published', (packet, client) => {
  if (!client) {
    return;
  }
  console.log(`${client.id} published message ${packet.payload} to topic: ${packet.topic}`);
});

// fired when a client subscribes to a topic
server.on('subscribed', (topic, client) => {
  if (!client) {
    return;
  }
  console.log(`client ${client.id} subscribed toppic ${topic}`);
});

// fired when a client subscribes to a topic
server.on('unsubscribed', (topic, client) => {
  if (!client) {
    return;
  }
  console.log(`client ${client.id} unsubscribed toppic ${topic}`);
});

// fired when a client is disconnecting
server.on('clientDisconnecting', (client) => {
  console.log(`client ${client.id} clientDisconnecting`);
});

// fired when a client is disconnected
server.on('clientDisconnected', (client) => {
  console.log(`client ${client.id} clientDisconnected`);
});
