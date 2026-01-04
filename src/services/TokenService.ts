import { randomInt } from "crypto";
import { db } from "./db";

// Expanded word lists for higher entropy
const ADJECTIVES = [
  "happy", "purple", "brave", "calm", "swift", "bright", "silent", "wise",
  "ancient", "modern", "fast", "slow", "green", "blue", "red", "yellow",
  "quiet", "loud", "soft", "hard", "smooth", "rough", "cold", "hot",
  "wild", "tame", "proud", "humble", "rich", "poor", "strong", "weak",
  "clever", "foolish", "kind", "cruel", "sweet", "sour", "fresh", "stale",
  "golden", "silver", "bronze", "iron", "steel", "wooden", "stone", "glass",
  "sunny", "rainy", "windy", "snowy", "stormy", "cloudy", "misty", "foggy"
];

const NOUNS = [
  "tiger", "eagle", "ocean", "mountain", "forest", "river", "star", "moon",
  "lion", "wolf", "bear", "hawk", "shark", "whale", "dolphin", "seal",
  "tree", "flower", "grass", "leaf", "root", "branch", "seed", "fruit",
  "stone", "rock", "sand", "dust", "clay", "mud", "dirt", "soil",
  "fire", "water", "air", "earth", "metal", "wood", "ice", "steam",
  "king", "queen", "prince", "knight", "wizard", "witch", "giant", "elf",
  "city", "town", "village", "castle", "tower", "bridge", "road", "path"
];

const VERBS = [
  "jump", "fly", "run", "swim", "glow", "sing", "dance", "dream",
  "walk", "crawl", "climb", "dive", "float", "sink", "rise", "fall",
  "eat", "drink", "sleep", "wake", "talk", "shout", "whisper", "listen",
  "look", "watch", "see", "hear", "touch", "feel", "smell", "taste",
  "build", "break", "fix", "make", "create", "destroy", "save", "help",
  "learn", "teach", "read", "write", "draw", "paint", "play", "work"
];

class TokenService {
  // Generate a secure readable passphrase (e.g., "purple-tiger-jump-83921")
  private generatePassphrase(): string {
    const adj = ADJECTIVES[randomInt(ADJECTIVES.length)];
    const noun = NOUNS[randomInt(NOUNS.length)];
    const verb = VERBS[randomInt(VERBS.length)];
    // Add 6 digits of entropy (0-999999)
    const suffix = randomInt(0, 1000000).toString().padStart(6, '0');
    
    return `${adj}-${noun}-${verb}-${suffix}`;
  }

  // Get or create a token for a user
  async getOrCreateToken(email: string): Promise<string> {
    const existingToken = await db.getToken(email);
    if (existingToken) {
      return existingToken;
    }

    const token = this.generatePassphrase();
    await db.saveToken(email, token);
    return token;
  }

  // Validate token
  async validateToken(token: string): Promise<string | null> {
    return await db.getUserByToken(token);
  }
}

export const tokenService = new TokenService();
