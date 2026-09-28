import { describe, expect, it } from 'vitest';
import { AssistantService } from '../assistant.service';
import { MockAssistantProvider } from '../mock-assistant.provider';

describe('AssistantService & MockAssistantProvider', () => {
  it('processes user message and returns structured assistant response', async () => {
    const service = new AssistantService(new MockAssistantProvider());
    const initialSession = service.loadSession('test_session_1');

    const res = await service.sendMessage(
      'Show me smartphones under 30k',
      initialSession
    );

    expect(res.responseMessage.sender).toBe('assistant');
    expect(res.responseMessage.payload).toBeDefined();
    expect(res.responseMessage.payload?.intent.type).toBe('product_search');
    expect(res.updatedContext.messages.length).toBe(2);
  });

  it('handles reset session cleanly', () => {
    const service = new AssistantService(new MockAssistantProvider());
    const reset = service.resetSession('test_session_1');

    expect(reset.messages.length).toBe(0);
  });
});
