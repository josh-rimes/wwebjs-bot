require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');


// Create new client instance
const client = new Client({
    puppeteer: {
        headless: true,
    },
    authStrategy: new LocalAuth()
});


// Initialise OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY
});


const BOT_NAME = "whatsuppbot";


// When the client receives a QR-Code
client.on('qr', (qr) => {
    console.log('QR-Code received.');
    qrcode.generate(qr, {small: true});
});


// When the client is ready, run this code ONCE ONLY
client.once('ready', async () => {
    console.log('WhatsUppBot is ready!');
});


let chatHistory = [];


// Handle incoming messages
client.on('message', async msg => {
    const text = msg.body.toLowerCase();

    // Find sender
    const contact = await msg.getContact();
    
    try {
        // Only respond when named and gnore empty or media messages
        if (!text.includes(BOT_NAME.toLowerCase()) || !msg.body) 
            {
                console.log("Not my business!")
                return;
            }

        console.log(`Mention detected from ${msg.from}: ${msg.body}`);

        // Trim message and add it to chat history
        const cleanText = msg.body.replace(new RegExp(BOT_NAME, "ig"), "").trim();
        chatHistory.push({ role: "user", content: cleanText || msg.body })
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

        // Send message to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful and friendly AI assistant called WhatsUppBot on WhatsApp. Only reply when directly mentioned. You are forbidden to provide any political viewpoints." },
                ...chatHistory
            ]
        });

        const replyText = response.choices[0].message.content;
        const mentionText = `@${contact.number} ${replyText}`;

        // Save AI reply
        chatHistory.push({ role: "assistant", content: mentionText });
        await msg.reply(mentionText, msg.from, { mentions: [contact] })

    } catch (err) {
        console.error("Error:", err.message);
        await msg.reply(`Sorry @${contact.number}, something went wrong!`, msg.from, { mentions: [contact] })
    }
});


// Start the client
client.initialize();