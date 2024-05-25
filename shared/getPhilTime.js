 const getPhilippineTime = () => {
    const currentDate = new Date();
  const utcTime = currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;
  const timezoneOffset = 8 * 60 * 60 * 1000; // UTC+8 in milliseconds
  return new Date(utcTime + timezoneOffset);
  };
module.exports = {getPhilippineTime}