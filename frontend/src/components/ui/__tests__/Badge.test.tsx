import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('renders badge content', () => {
    render(<Badge tone="emerald">Authentic</Badge>);
    expect(screen.getByText('Authentic')).toBeDefined();
  });

  it('renders with custom tone class', () => {
    const { container } = render(<Badge tone="crimson">Tampered</Badge>);
    expect(container.firstChild).toBeDefined();
    expect((container.firstChild as HTMLElement).className).toContain('text-rose-300');
  });
});
