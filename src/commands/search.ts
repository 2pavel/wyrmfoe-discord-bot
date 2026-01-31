import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import {
  messageToSearchString,
  extractSystemDescription,
} from "../utils/search_utils";

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
  const searchFor = messageToSearchString(
    interaction.options.getString("gift_name", true),
  );
  console.log(`Searching for: ${searchFor}`);
  const res = await fetch(
    `https://www.wyrmfoe.com/search/${searchFor}/feed/rss2/`,
  );
  const data = await res.text();
  fs.writeFile(path.resolve("output", "search_result"), data, (err) => {
    console.error(err);
  });

  console.log(res.status);

  const searchResult = extractSystemDescription(data);
  fs.writeFile(path.resolve("output", "filtered"), searchResult, (err) => {
    console.error(err);
  });

  return interaction.reply(searchResult);
}
