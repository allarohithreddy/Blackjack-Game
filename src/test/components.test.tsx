import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { BettingArea } from '../components/BettingArea';
import { Card as CardType } from '../types/blackjack';

describe('Card Component', () => {
  it('renders face-up card rank and suit', () => {
    const card: CardType = {
      id: 'c1',
      suit: 'hearts',
      rank: 'A',
      value: 11,
      isFaceUp: true,
    };

    render(<Card card={card} />);
    const rankElements = screen.getAllByText('A');
    expect(rankElements.length).toBeGreaterThan(0);
  });

  it('renders card back for face-down cards', () => {
    const card: CardType = {
      id: 'c2',
      suit: 'spades',
      rank: 'K',
      value: 10,
      isFaceUp: false,
    };

    render(<Card card={card} />);
    expect(screen.getByText('BJ')).toBeInTheDocument();
  });
});

describe('Chip Component', () => {
  it('renders chip value and responds to clicks', () => {
    const onClick = vi.fn();
    render(<Chip value={100} onClick={onClick} />);

    const chipButton = screen.getByText('$100');
    expect(chipButton).toBeInTheDocument();

    fireEvent.click(chipButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    const onClick = vi.fn();
    render(<Chip value={500} onClick={onClick} disabled />);

    const chipButton = screen.getByRole('button');
    expect(chipButton).toBeDisabled();

    fireEvent.click(chipButton);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('BettingArea Component', () => {
  it('triggers onDeal when bet is valid', () => {
    const onDeal = vi.fn();
    render(
      <BettingArea
        currentBet={50}
        bankroll={950}
        lastBet={50}
        onAddChip={vi.fn()}
        onClearBet={vi.fn()}
        onDoubleBet={vi.fn()}
        onAllIn={vi.fn()}
        onDeal={onDeal}
        isDealing={false}
      />
    );

    const dealButton = screen.getByText('Deal Hand');
    expect(dealButton).not.toBeDisabled();

    fireEvent.click(dealButton);
    expect(onDeal).toHaveBeenCalledTimes(1);
  });
});
