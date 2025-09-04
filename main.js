const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create new client instance
const client = new Client();

// When the client is ready, run this code ONCE ONLY
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client receives a QR-Code
client.on('qr', (qr) => {
    console.log('QR-Code received.');
    qrcode.generate(qr, {small: true});
});

// Listen to all incoming messages
client.on('message_create', message => {
    console.log(message.body);
});

// Start the client
client.initialize();