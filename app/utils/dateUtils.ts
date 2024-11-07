export function getDateWithLessHours(
  hoursLess: number,
  startDate: Date = new Date()
): Date {
  const newDate = new Date(startDate);
  newDate.setHours(startDate.getHours() - hoursLess);
  return newDate;
}
