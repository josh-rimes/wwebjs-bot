# wwebjs-bot

WhatsApp AI Chatbot using wwebjs and OpenAI

## Dependencies

This bot uses Pedros Lopez's [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js?tab=readme-ov-file) web bot as a framework.

It uses Node.js as well as whatsapp-web.js, dotenv, openai, & qrcode-terminal npm dependencies that can be installed to the repository directory using the following commands:

```bash
npm install whatsapp-web.js
npm install dotenv
npm install openai
npm install qrcode-terminal
```

The packages mentioned above must be of the following versions:
- Node.js : v18+
- whatsapp-web.js : v1.33.2+
- dotenv : v17.2.2+
- openai : v5.19.1+
- qrcode-terminal : v0.12.0+

## Set-Up

Before running, store your OpenAI API key in a .env file within the repository under the variable name OPENAI_API_KEY.

Run the main.js file:

```bash
npm start
```

Once running, a QR code will be outputed to the terminal (this QR code will refresh every 30 seconds). Head to 'linked devices' in the settings of your WhatsApp account and scan this QR code. The bot should connecta and a message should appear in the terminal.

Your bot is now ready to go!

## Usage

To use the bot, send a message to the connected account, making sure to mention the bots name anywhere in the message.

## License

[MIT](https://choosealicense.com/licenses/mit/)
