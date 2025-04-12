
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSelectedDate, openModal } from '@/store/calendarSlice';
import { addDays, addWeeks, format, parseISO } from 'date-fns';
import { getDaysOfWeek, formatShortDate } from '@/lib/calendarUtils';

const CalendarHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state: RootState) => state.calendar);
  
  const selectedDateObj = parseISO(selectedDate);
  
  const days = getDaysOfWeek(selectedDateObj);

  const handlePrevWeek = () => {
    dispatch(setSelectedDate(addWeeks(selectedDateObj, -1)));
  };

  const handleNextWeek = () => {
    dispatch(setSelectedDate(addWeeks(selectedDateObj, 1)));
  };

  const handleToday = () => {
    dispatch(setSelectedDate(new Date()));
  };

  const handleCreateEvent = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = Math.floor(now.getMinutes() / 15) * 15;
    dispatch(openModal({ day: selectedDateObj, hour, minute }));
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <Button onClick={handleToday} variant="outline" size="sm">
            Today
          </Button>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePrevWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-medium">
            {format(days[0], 'MMMM yyyy')}
          </h2>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      <div className="grid grid-cols-8 gap-0">
        <div className="text-right pr-4 text-gray-500 pt-4"></div>
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`text-center py-2 border-l border-gray-200 ${
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') 
                ? 'bg-blue-50' 
                : ''
            }`}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div 
              className={`text-2xl ${
                format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ? 'bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto'
                  : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
