import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with children text', () => {
    render(<Button>Verify Now</Button>);
    expect(screen.getByRole('button', { name: /verify now/i })).toBeDefined();
  });

  it('applies disabled attribute when disabled prop is set', () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByRole('button', { name: /disabled action/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
