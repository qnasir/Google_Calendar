
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getDaysOfWeek, getEventsForDay } from '@/lib/calendarUtils';
import Event from './Event';
import { openModal, createEventFromTask } from '@/store/calendarSlice';

const hours = Array.from({ length: 24 }, (_, i) => i);

const WeekView: React.FC = () => {
  const dispatch = useDispatch();
  const { events, selectedDate } = useSelector((state: RootState) => state.calendar);
  const days = getDaysOfWeek(selectedDate);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToCurrentTime = () => {
    if (containerRef.current) {
      const now = new Date();
      const hour = now.getHours();
      containerRef.current.scrollTop = hour * 48 - 100; 
    }
  };
  
  useEffect(() => {
    scrollToCurrentTime();
  }, []);
  
  const handleTimeSlotClick = (day: Date, hour: number, minute: number = 0) => {
    dispatch(openModal({ day, hour, minute }));
  };
  
  const handleTaskDrop = (e: React.DragEvent<HTMLDivElement>, day: Date, hour: number, minute: number = 0) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (taskId) {
      dispatch(createEventFromTask({ taskId, day, hour, minute }));
    }
  };
  
  const getDayWidth = (): number => {
    if (containerRef.current) {
      const calendarWidth = containerRef.current.clientWidth - 48; 
      return calendarWidth / 7; 
    }
    return 0;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'copy';
  };
  
  return (
    <div ref={containerRef} className="flex overflow-auto h-full">
      <div className="flex">
        <div className="w-12 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="time-slot flex justify-end">
              <div className="time-label">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-1">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="calendar-day">
              {hours.map((hour) => (
                <div 
                  key={`${dayIndex}-${hour}`} 
                  className="time-slot"
                  onClick={() => handleTimeSlotClick(day, hour)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleTaskDrop(e, day, hour)}
                >
                  {[0, 15, 30, 45].map((minute) => (
                    <div 
                      key={`${dayIndex}-${hour}-${minute}`}
                      className="h-3 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimeSlotClick(day, hour, minute);
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleTaskDrop(e, day, hour, minute);
                      }}
                    />
                  ))}
                  
                  {new Date().getHours() === hour && 
                   new Date().getDate() === day.getDate() && 
                   new Date().getMonth() === day.getMonth() && 
                   new Date().getFullYear() === day.getFullYear() && (
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                      style={{ top: `${new Date().getMinutes() / 60 * 48}px` }}
                    />
                  )}
                </div>
              ))}
              
              {getEventsForDay(events, day).map((event) => (
                <Event 
                  key={event.id} 
                  event={event} 
                  dayWidth={getDayWidth()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
