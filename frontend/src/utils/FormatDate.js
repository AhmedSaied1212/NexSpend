import { formatDistanceToNow, format } from "date-fns";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now - date;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  // 1. Today
  if (isToday) return "Today";

  // 2. Yesterday
  if (isYesterday) return "Yesterday";

  // 3. within 7 days → relative time
  if (diffInDays <= 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // 4. older than a week → fixed date
  return format(date, "d/M/yyyy");
};