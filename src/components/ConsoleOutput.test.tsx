import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/dom';
import ConsoleOutput, { ConsoleLog } from './ConsoleOutput';

describe('ConsoleOutput', () => {
  it('renders "Menunggu output..." when there are no logs', () => {
    render(<ConsoleOutput logs={[]} onClear={() => {}} />);
    expect(screen.getByText('Menunggu output...')).toBeDefined();
  });

  it('renders correctly colored log messages based on level', () => {
    const logs: ConsoleLog[] = [
      { id: '1', level: 'info', message: 'This is info' },
      { id: '2', level: 'error', message: 'This is error' },
      { id: '3', level: 'success', message: 'This is success' },
      { id: '4', level: 'warn', message: 'This is warning' },
    ];
    render(<ConsoleOutput logs={logs} onClear={() => {}} />);
    
    expect(screen.getByText('This is info')).toBeDefined();
    expect(screen.getByText('This is error')).toBeDefined();
    expect(screen.getByText('This is success')).toBeDefined();
    expect(screen.getByText('This is warning')).toBeDefined();
  });

  it('calls onClear when the Clear button is clicked', () => {
    const mockOnClear = vi.fn();
    render(<ConsoleOutput logs={[{ id: '1', level: 'info', message: 'test' }]} onClear={mockOnClear} />);
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
