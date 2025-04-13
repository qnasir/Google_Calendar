import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CalendarEvent } from '@/types/calendar';
import { getEventPosition, formatTime, calculateDragDeltas } from '@/lib/calendarUtils';
import { moveEvent, editEvent, updateEvent } from '@/store/calendarSlice';

interface EventProps {
  event: CalendarEvent;
  dayWidth: number;
}

const Event: React.FC<EventProps> = ({ event, dayWidth }) => {
  const dispatch = useDispatch();
  const eventRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialHeight, setInitialHeight] = useState(0);
  
  const { top, height } = getEventPosition(event);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (eventRef.current && isDragging) {
        eventRef.current.style.opacity = '0.7';
        eventRef.current.style.pointerEvents = 'none';
      }
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      
      if (eventRef.current) {
        eventRef.current.style.opacity = '1';
        eventRef.current.style.pointerEvents = 'auto';
        
        const { dayDelta, minuteDelta } = calculateDragDeltas(
          dragStart.x,
          dragStart.y,
          upEvent.clientX,
          upEvent.clientY,
          dayWidth
        );
        
        if (dayDelta !== 0 || minuteDelta !== 0) {
          dispatch(moveEvent({ event, dayDelta, minuteDelta }));
        }
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (eventRef.current) {
      setInitialHeight(eventRef.current.offsetHeight);
    }
    
    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (eventRef.current && isResizing) {
        const deltaY = moveEvent.clientY - dragStart.y;
        const newHeight = Math.max(initialHeight + deltaY, 12); 
        eventRef.current.style.height = `${newHeight}px`;
      }
    };
    
    const handleResizeEnd = (upEvent: MouseEvent) => {
      setIsResizing(false);
      
      if (eventRef.current) {
        const deltaY = upEvent.clientY - dragStart.y;
        const minutesDelta = Math.round(deltaY * 1.25);
        
        if (minutesDelta !== 0) {
          const startDate = new Date(event.start);
          const newEnd = new Date(event.end);
          newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);
          
          const minEndTime = new Date(startDate);
          minEndTime.setMinutes(minEndTime.getMinutes() + 5);
          
          if (newEnd > minEndTime) {
            dispatch(updateEvent({
              ...event,
              end: newEnd.toISOString() 
            }));
          } else {
            if (eventRef.current) {
              const { height } = getEventPosition(event);
              eventRef.current.style.height = `${height}px`;
            }
          }
        }
      }
      
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(editEvent(event));
  };

  const getEventStyle = () => {
    if (event.color) {
      return {
        backgroundColor: event.color,
        borderLeft: `4px solid ${event.color}`,
      };
    }
    return {};
  };
  
  return (
    <div
      ref={eventRef}
      className={`calendar-event ${event.color ? '' : `event-${event.category}`}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 16)}px`,
        ...getEventStyle(),
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      {height > 30 && (
        <div className="text-xs opacity-90">
          {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
        </div>
      )}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default Event;
