export function formatDate(dateTime) {
  const date = new Date(dateTime);

  // Subtract 8 hours (8 * 60 * 60 * 1000 milliseconds)
  date.setTime(date.getTime() - (8 * 60 * 60 * 1000));

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
    // Optionally add timeZone: 'UTC' if you want to output as UTC now
  };
  return date.toLocaleString('en-US', options);
}
