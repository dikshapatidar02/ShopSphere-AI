import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecommendationRail } from '../components/RecommendationRail';
import { RecommendationReason } from '../components/RecommendationReason';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('Recommendation UI Components', () => {
  it('renders RecommendationReason badge correctly', () => {
    render(<RecommendationReason explanation="Similar category and price range" />);
    expect(screen.getByText('Similar category and price range')).toBeDefined();
  });

  it('renders RecommendationRail section header and skeleton when loading', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <RecommendationRail strategy="trending" titleOverride="Trending Test Rail" />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText('Loading recommendations')).toBeDefined();
  });
});
