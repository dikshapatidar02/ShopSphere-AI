import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { AssistantPanel } from '../components/AssistantPanel';

describe('AssistantPanel UI Component', () => {
  it('renders floating trigger button and toggles open assistant panel', () => {
    render(<AssistantPanel />);

    const triggerBtn = screen.getByLabelText(/Open AI Shopping Assistant/i);
    expect(triggerBtn).toBeDefined();

    // Click trigger to open panel
    fireEvent.click(triggerBtn);

    expect(screen.getByRole('dialog', { name: /AI Shopping Assistant/i })).toBeDefined();
    expect(screen.getByText(/How can I help your shopping today\?/i)).toBeDefined();
  });
});
