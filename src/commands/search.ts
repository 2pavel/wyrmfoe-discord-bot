import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { messageToSearchString, extractGiftData } from "../utils/search_utils";

export const data = new SlashCommandBuilder()
  .setName("gift")
  .setDescription("Search for a gift")
  .addStringOption((option) =>
    option
      .setName("gift_name")
      .setDescription("The gift to search for")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("gift_name", true);
  const searchFor = messageToSearchString(message);
  console.log(`Searching for: ${searchFor}`);

  await interaction.deferReply();

  const res = await fetch(
    `https://www.wyrmfoe.com/search/${searchFor}/feed/rss2?orderby=relevance`,
  );
  const data = await res.text();

  console.log(res.status);

  const searchResult = extractGiftData(data, searchFor);
  fs.writeFile(path.resolve("output", "filtered"), searchResult, (err) => {
    if (err) console.error(err);
  });

  if (!searchResult) {
    return interaction.editReply(`No results found for "${message}".`);
  }

  return interaction.editReply(searchResult);
}
