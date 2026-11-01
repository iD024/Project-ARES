import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button.tsx';
import { Badge } from './Badge.tsx';
import { Slider } from './Slider.tsx';
import { Tabs } from './Tabs.tsx';
import { Drawer } from './Drawer.tsx';
import { Modal } from './Modal.tsx';

describe('UI Primitives (TasteSkill Aerospace System)', () => {
  describe('Button', () => {
    it('renders with tactical styling and fires onClick', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>INITIALIZE SCAN</Button>);
      const btn = screen.getByRole('button', { name: /INITIALIZE SCAN/i });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state properly', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>OFFLINE</Button>);
      const btn = screen.getByRole('button', { name: /OFFLINE/i });
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('renders observed and derived classifications with distinct styles', () => {
      const { rerender } = render(<Badge variant="OBSERVED">Observed</Badge>);
      expect(screen.getByText('Observed')).toHaveClass('text-cyan-400');

      rerender(<Badge variant="DERIVED">Derived</Badge>);
      expect(screen.getByText('Derived')).toHaveClass('text-amber-400');
    });
  });

  describe('Slider', () => {
    it('renders value and triggers onChange callback', () => {
      const handleChange = vi.fn();
      render(
        <Slider
          label="Opacity"
          value={0.8}
          min={0}
          max={1}
          step={0.05}
          onChange={handleChange}
        />
      );

      expect(screen.getByText('Opacity')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();

      const input = screen.getByRole('slider');
      fireEvent.change(input, { target: { value: '0.5' } });
      expect(handleChange).toHaveBeenCalledWith(0.5);
    });
  });

  describe('Tabs', () => {
    it('renders tab list and triggers tab selection', () => {
      const handleSelect = vi.fn();
      const items = [
        { id: 'surface', label: 'Surface' },
        { id: 'elevation', label: 'Elevation' },
      ];

      render(<Tabs tabs={items} activeTab="surface" onTabChange={handleSelect} />);
      expect(screen.getByText('Surface')).toBeInTheDocument();
      expect(screen.getByText('Elevation')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Elevation'));
      expect(handleSelect).toHaveBeenCalledWith('elevation');
    });
  });

  describe('Drawer', () => {
    it('renders content when open and triggers onClose', () => {
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} title="Planetary Layers" onClose={handleClose} side="left">
          <div>Layer Drawer Content</div>
        </Drawer>
      );

      expect(screen.getByText('Planetary Layers')).toBeInTheDocument();
      expect(screen.getByText('Layer Drawer Content')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText(/Close drawer/i);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not render when isOpen is false', () => {
      render(
        <Drawer isOpen={false} title="Planetary Layers" onClose={() => {}}>
          <div>Hidden Content</div>
        </Drawer>
      );

      expect(screen.queryByText('Planetary Layers')).not.toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    it('renders modal dialog with accessible title and closes on button click', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} title="Scientific Metadata" onClose={handleClose}>
          <div>NASA MOLA Metadata Body</div>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Scientific Metadata')).toBeInTheDocument();
      expect(screen.getByText('NASA MOLA Metadata Body')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText(/Close modal/i);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});

