
import React from 'react';
import CalendarHeader from './CalendarHeader';

const Calendar: React.FC = () => {
  return (
    <div className="calendar-container flex flex-col h-full bg-white rounded-lg shadow-lg">
      <CalendarHeader />
    </div>
  );
};

export default Calendar;
