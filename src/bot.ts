import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import wyrmfoeTags from "../resources/filteredTags.json";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", async () => {
  console.log("Discord bot is ready!");
  if (config.GUILD_ID) {
    await deployCommands({ guildId: config.GUILD_ID });
  }
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

// Base command handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  console.log(`Received command: ${commandName}`);
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands]
      .execute(interaction)
      .catch((err) => {
        console.error(`Error executing command ${commandName}:`, err);
      });
  }
});

// Autocomplete handler for the "browse" command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;
  if (interaction.commandName !== "browse") return;

  const focusedValue = interaction.options.getFocused();
  // const parts = focusedValue.split(/[,\s]+/);
  // const current = parts[parts.length - 1]?.toLowerCase() ?? "";
  if (focusedValue.length < 3) return;

  console.log(`Focused: ${focusedValue}`);
  // console.log(`Current: ${current}`);

  const filtered = wyrmfoeTags
    .filter((tag) =>
      tag.name.toLowerCase().includes(focusedValue.toLowerCase()),
    )
    .slice(0, 25);

  const results = filtered.map((tag) => ({
    name: `${tag.name}`,
    // name: `${tag.name}`,
    value: tag.id.toString(),
    // value: [...parts.slice(0, -1), tag].join(" "),
  }));

  interaction.respond(results).catch(() => {});
});

client.on("error", (err) => {
  console.error("Discord client error:", err);
});

client.login(config.BOT_TOKEN);
