export function convertTo12HourFormat(time: string): string {
  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}
