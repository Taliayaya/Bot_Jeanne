const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription(
			'Suggest something for the class, an event, anything you want !',
		)
		.addBooleanOption((option) =>
			option
				.setName('anonymous')
				.setDescription('Do you want to stay anonymous ?')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('suggestion')
				.setDescription('Your suggestion')
				.setRequired(true),
		)
		.setDMPermission(true),
	async execute(interaction) {
		const anonymous = interaction.options.getBoolean('anonymous');
		const suggestion = interaction.options.getString('suggestion');
		console.log(interaction);
		const channelPlace = interaction.guild.channels.cache.find((channel) =>
			channel.name.includes('suggestions'),
		);
		console.log(channelPlace);
		try {
			console.log('here', suggestion);
			const embed = new EmbedBuilder();
			console.log(embed);
			embed
				.setColor(0x0099ff)
				.setTitle('Suggestion')
				.setDescription(suggestion)
				.setFooter({ text: 'Suggestion by ' + interaction.user.username })
				.setTimestamp();
			console.log(embed);
			if (anonymous) {
				embed.setFooter({ text: 'Suggestion by anonymous' });
			}
			console.log('not here');
			await interaction.reply({ content: '', embeds: [embed] });
			//await channelPlace.send({ embeds: [embed] });
		} catch (error) {
			await interaction.reply({ content: error.message, ephemeral: true });
		}
	},
};
