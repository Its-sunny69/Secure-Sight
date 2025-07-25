export function formatRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const startTime = startDate.toLocaleTimeString("en-GB", options);
  const endTime = endDate.toLocaleTimeString("en-GB", options);

  const day = startDate.getDate();
  const month = startDate.toLocaleString("en-US", { month: "long" });
  const year = startDate.getFullYear();

  return `${startTime} - ${endTime} on ${day}-${month}-${year}`;
}

// Update timeToMinutes to handle UTC timestamps correctly
export function timeToMinutes(timestamp: string) {
  const date = new Date(timestamp);
  // Use UTC methods to get the actual time in the timestamp
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return hours * 60 + minutes; // Convert to total minutes in the day
}

// Update duration calculation
export function getIncidentDuration(tsStart: string, tsEnd: string) {
  const startMinutes = timeToMinutes(tsStart);
  const endMinutes = timeToMinutes(tsEnd);
  return endMinutes - startMinutes;
}

// Update time display function
export function minutesToTime(minutes: number) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

// Update the time display function to include seconds
export function minutesToTimeWithSeconds(minutes: number) {
  const totalSeconds = Math.round(minutes * 60); // Convert minutes to seconds
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// Returns seconds-from-midnight for timestamp
export function timeToSeconds(timestamp: string) {
  const date = new Date(timestamp);
  return (
    date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds()
  );
}

