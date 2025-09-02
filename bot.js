require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, prefix } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	client.user.setActivity(prefix + ' help');
	client.user.setStatus('idle');
});

client.on(Events.MessageCreate, message => {
	if (message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix)) return;

	if (message.content === client.user.tag) {
		message.channel.send(`My prefix is: ${prefix}`);
		return;
	}

	if (command === 'help') {
		message.channel.send(`Available commands:\n${prefix}clear - clean messages (need Administrator).\n${prefix}server - Provides server name\n${prefix}user-info - Provides your username and ID\n${prefix}help - Lists all commands`);
	} else if (command === 'user-info') {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	} else if (command === 'server') {
		message.channel.send(`This server's name is: ${message.guild.name}`);
	}

	// Admins commands - needs Administrator permission
	if (message.member.permissions.has('Administrator')) {
		if (command === 'clear') {
			const amount = parseInt(args[0]) + 1;
			if (isNaN(amount)) {
				return message.reply('that doesn\'t seem to be a valid number.');
			} else if (amount <= 1 || amount > 100) {
				return message.reply('you need to input a number between 1 and 99.');
			}
			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				message.channel.send('there was an error trying to prune messages in this channel!');
			});
		} else {
			message.channel.send('You do not have permission to use this command.');
		}
	}
});

try {
	client.login(token);
	require('./server')();
} catch (error) {
	console.error('Error logging in:', error);
}