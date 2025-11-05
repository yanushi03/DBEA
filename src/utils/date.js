export function formatDate(dateTime) {
  const date = new Date(dateTime);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  return date.toLocaleDateString('en-US', options)
}