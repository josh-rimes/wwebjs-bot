require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');


// Create new client instance
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
});


// Initialise OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY
});


// When the client receives a QR-Code
client.on('qr', (qr) => {
    console.log('QR-Code received.');
    qrcode.generate(qr, {small: true});
});


// When the client is ready, run this code ONCE ONLY
client.once('ready', async () => {
    console.log('WhatsUpp bot is ready!');

    const myNumber = process.env.PHONE_NUMBER + "@c.us";

    await client.sendMessage(myNumber, "Hi! I'm your AI chat bot. Start chatting with me here.");
});


let chatHistory = [];


// Handle incoming messages
client.on('message', async msg => {
    const myNumber = process.env.PHONE_NUMBER + "@c.us";

    // Ignore non-user messages
    if (msg.from !== myNumber) return;

    console.log("User message received.")
    // Save message and maintain up to 10 responses in history
    chatHistory.push({ role: "user", content: msg.body })
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

    try {
        // Ignore empty or media messages
        if (!msg.body) return;

        // Send message to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful AI assistant on WhatsApp. You are forbidden to provide any political viewpoints." },
                ...chatHistory
            ]
        });

        const reply = response.choices[0].message.content;
        // Save AI reply
        chatHistory.push({ role: "assistant", content: reply });
        await msg.reply(reply)

    } catch (err) {
        console.error("Error:", err.message);
        await msg.reply("Sorry, something went wrong!")
    }
});


// Start the client
client.initialize();