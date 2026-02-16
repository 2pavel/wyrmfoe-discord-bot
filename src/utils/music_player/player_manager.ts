import {
  AudioPlayer,
  createAudioPlayer,
  NoSubscriberBehavior,
  VoiceConnection,
} from "@discordjs/voice";

export class PlayerManager {
  connection: VoiceConnection | null = null;
  player: AudioPlayer | null = null;

  constructor(connection: VoiceConnection) {
    this.connection = connection;
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    this.connection.subscribe(this.player);
    this.registerListeners();
  }

  getPlayer(): AudioPlayer {
    return this.player!;
  }

  private registerListeners(): void {
    if (!this.player) return;

    this.player.on("stateChange", (oldState, newState) => {
      console.log(`Player: ${oldState.status} -> ${newState.status}`);
    });
    this.player.on("error", (error) => {
      console.error("Audio player error:", error);
    });
  }
}
