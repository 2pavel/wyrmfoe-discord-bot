import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";

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

client.on("error", (err) => {
  console.error("Discord client error:", err);
});

client.login(config.BOT_TOKEN);
