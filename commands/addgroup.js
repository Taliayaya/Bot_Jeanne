const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const fastcsv = require('fast-csv');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addgroup')
		.setDescription(
			'TE : Add a new group to the database. Each group must be constituted of 2 people and have a subject.',
		)
		.addStringOption((option) =>
			option
				.setName('fullname1')
				.setDescription('Name of the first person in the group')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('fullname2')
				.setDescription('Name of the second person in the group')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('subject')
				.setDescription('Subject of the group')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('fullname3')
				.setDescription('Name of the third person in the group (optional)'),
		),
	async execute(interaction) {
		const fullname1 = interaction.options.getString('fullname1');
		const fullname2 = interaction.options.getString('fullname2');
		const subject = interaction.options.getString('subject');
		const fullname3 = interaction.options.getString('fullname3') ?? '';
		try {
			await interaction.reply({
				content: `Greetings **${fullname1}**, **${fullname2}** ! You have chosen **${subject}** as your subject.`,
			});
			await interaction.followUp({
				content: 'Your request is under process. Please wait a moment.',
				ephemeral: true,
			});
			const ws = fs.createWriteStream('sujets_presentation.csv', {
				flags: 'a',
			});
			fastcsv.write([[fullname1, fullname2, subject, fullname3], []]).pipe(ws);
			await interaction.followUp({
				content: 'Your request has been processed successfully.',
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
