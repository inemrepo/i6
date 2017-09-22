const Telegraf = require('telegraf');
const token = sails.config.automation.telegram.token;

const bot = new Telegraf(token)


// Command handling
bot.hears('hi', (ctx) => {
	ctx.reply('Hello :-)');
})

// Start polling
bot.startPolling()