import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { playMusic } from "../utils/play_music";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play music");

export async function execute(interaction: ChatInputCommandInteraction) {
  console.log(`Executing play command for user ${interaction.user.tag}`);

  if (!interaction.inCachedGuild()) {
    return interaction.reply({
      content: "This command can only be used in a server.",
      flags: MessageFlags.Ephemeral,
    });
  }
  const member = interaction.member;

  if (!member.voice || !member.voice.channel) {
    return interaction.reply({
      content: "You need to be in a voice channel to use this command.",
      flags: MessageFlags.Ephemeral,
    });
  }

  await playMusic(member.voice.channel);
  return interaction.reply({
    content: "Playing music!",
    flags: MessageFlags.Ephemeral,
  });
}
