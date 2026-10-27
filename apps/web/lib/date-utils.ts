/**
 * Formats a Date or timestamp into a concise, human-friendly relative time string.
 * Examples: "Just now", "5m ago", "2h ago", "3d ago", "Oct 12".
 */
export function formatRelativeTime(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
