import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from './EmptyState.tsx';
import { LoadingOverlay } from './LoadingOverlay.tsx';
import { ErrorBanner } from './ErrorBanner.tsx';

describe('Feedback States (Empty, Loading, Error)', () => {
  describe('EmptyState', () => {
    it('renders title, description and optional action', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="NO ACTIVE WAYPOINTS"
          description="Select a landing site or click on the terrain to inspect coordinates."
          actionLabel="ADD WAYPOINT"
          onAction={handleAction}
        />
      );

      expect(screen.getByText('NO ACTIVE WAYPOINTS')).toBeInTheDocument();
      expect(screen.getByText(/Select a landing site/i)).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: /ADD WAYPOINT/i });
      fireEvent.click(btn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoadingOverlay', () => {
    it('renders with message when loading is true', () => {
      render(<LoadingOverlay isLoading={true} message="STREAMING MOLA ELEVATION TILES..." />);
      expect(screen.getByText('STREAMING MOLA ELEVATION TILES...')).toBeInTheDocument();
    });

    it('does not render when loading is false', () => {
      render(<LoadingOverlay isLoading={false} message="STREAMING..." />);
      expect(screen.queryByText('STREAMING...')).not.toBeInTheDocument();
    });
  });

  describe('ErrorBanner', () => {
    it('renders error message with retry and dismiss triggers', () => {
      const handleRetry = vi.fn();
      const handleDismiss = vi.fn();

      render(
        <ErrorBanner
          title="WMTS TILE STREAM TIMEOUT"
          message="Failed to retrieve tile from NASA Mars Trek. Check network connection."
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      );

      expect(screen.getByText('WMTS TILE STREAM TIMEOUT')).toBeInTheDocument();
      expect(screen.getByText(/Failed to retrieve tile/i)).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /RETRY/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);

      const dismissBtn = screen.getByLabelText(/Dismiss error/i);
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
