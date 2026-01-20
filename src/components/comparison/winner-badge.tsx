interface WinnerBadgeProps {
  winner: 0 | 1 | 2;
  position: 1 | 2;
}

export function WinnerBadge({ winner, position }: WinnerBadgeProps) {
  if (winner === 0) return null;

  const isWinner = winner === position;

  if (!isWinner) return null;

  return (
    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
      Winner
    </span>
  );
}
