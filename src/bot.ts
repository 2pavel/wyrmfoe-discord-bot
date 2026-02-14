import {
  Client,
  GatewayIntentBits,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import wyrmfoeTags from "../resources/filteredTags.json";
import {
  getRollResultMessage,
  isDicePoolValid,
  rollDice,
} from "./utils/roll_utils";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
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
  if (focusedValue.length < 3) return;

  console.log(`Focused: ${focusedValue}`);

  const filtered = wyrmfoeTags
    .filter((tag) =>
      tag.name.toLowerCase().includes(focusedValue.toLowerCase()),
    )
    .slice(0, 25);

  const results = filtered.map((tag) => ({
    name: `${tag.name}`,
    value: tag.id.toString(),
  }));

  interaction.respond(results).catch(() => {});
});

// Handler for difficulty buttons in the "roll" command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("difficulty_")) {
    const difficulty = interaction.customId.split("_")[1];

    const modal = new ModalBuilder()
      .setCustomId(`dice_modal_${difficulty}`)
      .setTitle("Enter Dice Pool");

    const diceInput = new TextInputBuilder()
      .setCustomId("dice_pool")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter number of dice")
      .setRequired(true);

    const diceLabel = new LabelBuilder()
      .setLabel("Dice Pool")
      .setTextInputComponent(diceInput);

    modal.addLabelComponents(diceLabel);

    await interaction.showModal(modal);
  }
});

// Handle modal submission for dice rolls
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId.startsWith("dice_modal_")) {
    const difficulty = Number(interaction.customId.split("_")[2]);
    const dicePool = Number(interaction.fields.getTextInputValue("dice_pool"));

    if (!isDicePoolValid(dicePool)) {
      return interaction.reply({
        content: "Nie kombinuj",
        flags: MessageFlags.Ephemeral,
      });
    }

    const rollResult = rollDice(dicePool, difficulty);
    await interaction.reply(getRollResultMessage(rollResult));
  }
});

client.on("error", (err) => {
  console.error("Discord client error:", err);
});

client.login(config.BOT_TOKEN);
