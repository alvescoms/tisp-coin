const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { token, clientId, guildId } = require('./config.json')

const commands = [
	new SlashCommandBuilder().setName('getcryptos').setDescription('Replies with all TISP Cryptos Currencies!'),
	new SlashCommandBuilder().setName('crypto').setDescription('Replies with specific TISP Cryptos Currencies!')
    .addStringOption(option => option.setName('crytptoname').setDescription('Enter Crypto to get Currrency')),
	new SlashCommandBuilder().setName('exchange').setDescription('Replies crypto currency conversion')
    .addStringOption(option => option.setName('cryptotoexchange').setDescription('Enter the Crypto'))
    .addStringOption(option => option.setName('quantity').setDescription('Enter the quantity')),
	new SlashCommandBuilder().setName('help').setDescription('Replies with all commands'),
	new SlashCommandBuilder().setName('cryptostag').setDescription('Replies all TISP cryptos TAGs')
].map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();