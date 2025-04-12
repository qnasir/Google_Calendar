
import React from 'react';
import CalendarHeader from './CalendarHeader';
import TaskSidebar from './TaskSidebar';


const Calendar: React.FC = () => {
  return (
    <div className="calendar-container flex flex-col h-full bg-white rounded-lg shadow-lg">
      <CalendarHeader />
      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar />
      </div>
    </div>
  );
};

export default Calendar;
