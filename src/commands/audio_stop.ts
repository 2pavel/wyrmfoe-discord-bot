import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { stopMusic } from "@utils/music_player/player_controls";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop music");

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const guild = interaction.guildId;

  if (guild) {
    await stopMusic(guild);
  }

  console.log("Playback stopped");
  await interaction.deleteReply();
  return;
}
