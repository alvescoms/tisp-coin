const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { token, clientId, guildId } = require('./config.json')

const commands = [
	new SlashCommandBuilder().setName('cryptos').setDescription('Replies with all TISP Cryptos Currencies!'),
	new SlashCommandBuilder().setName('crypto').setDescription('Replies with all TISP Cryptos Currencies!')
    .addStringOption(option => option.setName('actualcrypto').setDescription('Enter Crypto to get Currrency')),
	new SlashCommandBuilder().setName('currency').setDescription('Replies crypto currency conversion')
    .addStringOption(option => option.setName('checkcrypto').setDescription('Enter Crypto to Convert'))
    .addStringOption(option => option.setName('quantity').setDescription('Enter quantity'))
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