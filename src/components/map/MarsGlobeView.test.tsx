import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsGlobeView } from './MarsGlobeView.tsx';
import { GlobeControls } from './GlobeControls.tsx';

describe('MarsGlobeView & GlobeControls', () => {
  describe('GlobeControls', () => {
    it('renders navigation buttons and triggers camera controls', () => {
      const handleReset = vi.fn();
      const handleNorth = vi.fn();
      const handleTilt = vi.fn();

      render(
        <GlobeControls
          onResetView={handleReset}
          onRotateNorth={handleNorth}
          onToggleTilt={handleTilt}
        />
      );

      const resetBtn = screen.getByRole('button', { name: /Reset orbital view/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);

      const northBtn = screen.getByRole('button', { name: /Orient north/i });
      fireEvent.click(northBtn);
      expect(handleNorth).toHaveBeenCalledTimes(1);

      const tiltBtn = screen.getByRole('button', { name: /Toggle surface tilt/i });
      fireEvent.click(tiltBtn);
      expect(handleTilt).toHaveBeenCalledTimes(1);
    });
  });

  describe('MarsGlobeView', () => {
    it('renders globe container and navigation controls overlay', () => {
      render(<MarsGlobeView />);
      expect(screen.getByTestId('ares-globe-container')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset orbital view/i })).toBeInTheDocument();
    });
  });
});

