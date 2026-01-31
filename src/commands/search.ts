import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("gift")
  .setDescription("Search for a gift");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Command received: gift");
}
