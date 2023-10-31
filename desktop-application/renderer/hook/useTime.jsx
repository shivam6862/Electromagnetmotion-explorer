export const useTime = () => {
  const getCurrentDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = months[monthIndex];
    const formattedDate = `${day} ${monthName} ${year}`;
    return formattedDate;
  };
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const dayName = days[dayOfWeek];
    return dayName;
  };
  return {
    getCurrentDate,
    getCurrentDay,
  };
};
