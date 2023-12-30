// Returns human-readable date based on the difference between the current date and the date passed in
export const humanDate = (date: Date | null | undefined): string => {
  if (!date) {
    return "Unknown";
  }

  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 1) {
    return "yesterday";
  } else if (daysDiff === 0) {
    return "today";
  } else if (daysDiff < 30) {
    return `${daysDiff} days ago`;
  } else if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    const remainingDays = daysDiff % 30;
    return `${months} months ${remainingDays} days ago`;
  } else {
    return "over a year ago";
  }
};
