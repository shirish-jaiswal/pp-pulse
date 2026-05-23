export function validateDateRange(start: Date, end: Date) {
  if (start.getTime() > end.getTime()) {
    return {
      valid: false,
      message: "End date cannot be earlier than start date.",
    }
  }

  return {
    valid: true,
  }
}