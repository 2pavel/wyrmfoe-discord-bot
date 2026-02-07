import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("roll")
  .setDescription("Roll the dice");

export async function execute(interaction: ChatInputCommandInteraction) {
  const difficultyButtons = [];
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

  for (let i = 1; i <= 10; i++) {
    const button = new ButtonBuilder()
      .setCustomId(`difficulty_${i}`)
      .setLabel(`${i}`)
      .setStyle(ButtonStyle.Primary);

    difficultyButtons.push(button);
  }

  for (let i = 0; i < difficultyButtons.length; i += 5) {
    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        difficultyButtons.slice(i, i + 5),
      );
    rows.push(row);
  }

  await interaction.reply({
    content: "Choose a difficulty:",
    components: rows,
    flags: MessageFlags.Ephemeral,
  });
}
