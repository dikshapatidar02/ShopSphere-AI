import type { IAssistantProvider } from '@/types/assistant';
import { MockAssistantProvider } from './mock-assistant.provider';

export type { IAssistantProvider };

export class AssistantProviderFactory {
  public static createProvider(): IAssistantProvider {
    return new MockAssistantProvider();
  }
}
