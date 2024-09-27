export default function generatePostgresTimestamp(duration: { months?: number; days?: number; hours?: number; minutes?: number; seconds?: number } = {}) {
  // Get the current date and time
  const now = new Date();

  // Extract duration components and add them to the current date
  const {
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = duration;

  // Add the respective values to the current date
  now.setMonth(now.getMonth() + months);
  now.setDate(now.getDate() + days);
  now.setHours(now.getHours() + hours);
  now.setMinutes(now.getMinutes() + minutes);
  now.setSeconds(now.getSeconds() + seconds);

  // Format the resulting date to a PostgreSQL-compatible timestamp (YYYY-MM-DD HH:MM:SS)
  const postgresTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');

  return postgresTimestamp;
}
