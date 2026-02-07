import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";
import { convertDataToMsg } from "../utils/filter_tag_browse_result";

export const data = new SlashCommandBuilder()
  .setName("browse")
  .setDescription("Filter gifts by tags")
  .addStringOption((option) =>
    option
      .setName("tags")
      .setDescription("The tags to filter by")
      .setRequired(true)
      .setAutocomplete(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("tags", true);

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  console.log(`Filtering by tags: ${message.toString()}`);
  const res = await fetch(
    `https://www.wyrmfoe.com/wp-json/wp/v2/posts?tags[operator]=AND&tags[terms]=${message}&per_page=100`,
  );
  console.log(res.status);
  const data = await res.json();
  const msgToSend = convertDataToMsg(data);

  fs.writeFile(
    path.resolve("output", "tagBrowseResult"),
    // JSON.stringify(filteredData, null, 2),
    msgToSend,
    (err) => {
      if (err) console.error(err);
    },
  );

  return interaction.editReply({
    content: msgToSend,
  });
}

// TODO: Consider scrapping this completely. Character limit makes it hard to use. Maybe create a web page with results.
