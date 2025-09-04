const { Client } = require('whatsapp-web.js');

// Create new client instance
const client = new Client();

// When the client is ready, run this code ONCE ONLY
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client receives a QR-Code
client.on('qr', (qr) => {
    console.log('QR-Code received.', qr);
});

// Start the client
client.initialize();