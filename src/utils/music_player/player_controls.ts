import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  entersState,
  StreamType,
  AudioPlayer,
} from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import path from "path";
import fs from "fs";
import { PlayerManager } from "./player_manager";
import { PlayerInstanceHandler } from "./player_instance_handler";

export async function playMusic(channel: VoiceBasedChannel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  connection.on("stateChange", (oldState, newState) => {
    console.log(`Voice connection: ${oldState.status} -> ${newState.status}`);
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
  } catch (error) {
    console.error("Failed to connect to voice channel");
    connection.destroy();
    throw error;
  }

  const player = PlayerInstanceHandler.create(channel.guild.id, connection);

  const filePath = path.resolve(
    __dirname,
    "../../../resources",
    "Neonowe pazury kurde bele.mp3",
  );
  console.log("File exists:", fs.existsSync(filePath));
  console.log(`Playing file: ${filePath}`);

  const resource = createAudioResource(filePath, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);
  // const subscription = connection.subscribe(player);
  // console.log(`Subscribed to audio player: ${subscription}`);
  try {
    await entersState(player, AudioPlayerStatus.Playing, 5_000);
    console.log("Playback has started!");
  } catch (error) {
    console.error(error);
  }

  player.once(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });
}

export async function stopMusic(guildId: string) {
  const player = PlayerInstanceHandler.get(guildId);

  if (player) {
    player.stop();
  }
}
