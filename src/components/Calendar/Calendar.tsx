
import React from 'react';
import CalendarHeader from './CalendarHeader';
import TaskSidebar from './TaskSidebar';
import WeekView from './WeekView';
import EventModal from './EventModal';


const Calendar: React.FC = () => {
  return (
    <div className="calendar-container flex flex-col h-full bg-white rounded-lg shadow-lg">
      <CalendarHeader />
      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar />
        <div className="flex-1 overflow-hidden border-l border-gray-200">
          <WeekView />
        </div>
      </div>
      <EventModal />
    </div>
  );
};

export default Calendar;
