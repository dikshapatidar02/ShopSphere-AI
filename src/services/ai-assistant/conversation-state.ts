import { getSafeStorage } from '@/lib/storage';
import type { ConversationContext } from '@/types/assistant';

const STORAGE_PREFIX = 'shopsphere_assistant_session_';

export class ConversationStateService {
  private static getStorageKey(sessionId: string, userId?: string): string {
    return `${STORAGE_PREFIX}${userId || 'guest'}_${sessionId}`;
  }

  public static loadContext(sessionId: string, userId?: string): ConversationContext {
    try {
      const key = this.getStorageKey(sessionId, userId);
      const raw = getSafeStorage().getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as ConversationContext;
        if (parsed && Array.isArray(parsed.messages)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }

    return {
      sessionId,
      userId,
      messages: [],
    };
  }

  public static saveContext(context: ConversationContext): void {
    try {
      const key = this.getStorageKey(context.sessionId, context.userId);
      getSafeStorage().setItem(key, JSON.stringify(context));
    } catch {
      // Quota or unavailable
    }
  }

  public static createNewSession(sessionId: string, userId?: string): ConversationContext {
    const fresh: ConversationContext = {
      sessionId,
      userId,
      messages: [],
    };
    this.saveContext(fresh);
    return fresh;
  }
}
