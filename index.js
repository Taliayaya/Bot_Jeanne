require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	GatewayIntentBits,
	Collection,
	ActivityType,
} = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* ================
 * Retrieving all commands from the commands folder
 * ================
 */
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

/* ================
 * Retrieving all events from the events folder
 * ================
 */
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const even = require(filePath);
	if (even.once) {
		client.once(even.name, (...args) => even.execute(...args));
	} else {
		client.on(even.name, (...args) => even.execute(...args));
	}
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setActivity('Luminosité Éternelle saving the world', {
		type: ActivityType.Watching,
	});
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

console.log(client.user);
client.login(token);
