function getDateDetails(dateString: Date | string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday =  date.getDay();
    return {year, month, day,weekday};
  }
  
  function getDateWithSeparator(
    dateString: Date | string,
    separator: string = '',
  ) {
    const {year, month, day} = getDateDetails(dateString);
  
    return [
      String(year),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join(separator);
  }
  

  function getDateLocaleFormat(dateString: Date | string) {
    const {year, month, day} = getDateDetails(dateString);
  
    return `${year}년 ${month}월 ${day}일`;
  }
  
  function getMonthYearDetails() {
    const month =  new Date().getMonth() + 1;
    const year =  new Date().getFullYear();
    const startDate = new Date();
    const firstDOW = startDate.getDate();

    const lastDateString = String(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      ).getDate(),
    );
    const lastDate = Number(lastDateString);
  
    return {month, year, startDate, firstDOW, lastDate};
  }
  
  type MonthYear = {
    month: number;
    year: number;
    startDate: Date;
    firstDOW: number;
    lastDate: number;
  };
  

  function isSameAsCurrentDate(year: number, month: number, date: number) {
    const currentDate = getDateWithSeparator(new Date());

    const inputDate = `${year}${String(month).padStart(2, '0')}${String(
      date,

      
    ).padStart(2, '0')}`;

    return currentDate === inputDate;
  }
  
  export {
    getDateLocaleFormat,
    getMonthYearDetails,
    isSameAsCurrentDate,
  };
  export type {MonthYear};
  
  