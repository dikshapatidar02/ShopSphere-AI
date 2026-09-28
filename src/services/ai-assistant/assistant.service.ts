import type { ChatMessage, ConversationContext, IAssistantProvider } from '@/types/assistant';
import { MockAssistantProvider } from './mock-assistant.provider';
import { ConversationStateService } from './conversation-state';

export class AssistantService {
  constructor(
    private readonly provider: IAssistantProvider = new MockAssistantProvider()
  ) {}

  public loadSession(sessionId: string, userId?: string): ConversationContext {
    return ConversationStateService.loadContext(sessionId, userId);
  }

  public async sendMessage(
    messageText: string,
    context: ConversationContext
  ): Promise<{ responseMessage: ChatMessage; updatedContext: ConversationContext }> {
    return this.provider.sendMessage(messageText, context);
  }

  public resetSession(sessionId: string, userId?: string): ConversationContext {
    return this.provider.resetSession(sessionId, userId);
  }
}

export const assistantService = new AssistantService();
