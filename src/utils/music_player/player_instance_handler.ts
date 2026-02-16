import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { PlayerManager } from "./player_manager";

/**
 * Manages player instances for different guilds.
 *
 * This class maintains a map of guild IDs to their corresponding PlayerManager instances,
 * allowing creation, retrieval, and deletion of audio players for different Discord servers.
 * Only one PlayerManager instance is created per guild.
 */
export class PlayerInstanceHandler {
  private static audioManagers = new Map<string, PlayerManager>();

  static create(guildId: string, connection: VoiceConnection): AudioPlayer {
    const manager = new PlayerManager(connection);
    PlayerInstanceHandler.audioManagers.set(guildId, manager);
    return manager.getPlayer();
  }

  static get(guildId: string): AudioPlayer | undefined {
    return PlayerInstanceHandler.audioManagers.get(guildId)?.getPlayer();
  }

  static delete(guildId: string): void {
    PlayerInstanceHandler.audioManagers.delete(guildId);
  }
}
