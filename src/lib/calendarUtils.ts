
import { CalendarEvent } from '@/types/calendar';
import { addDays, format, isSameDay, startOfWeek, parseISO, startOfDay, endOfDay, addMinutes } from 'date-fns';

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const formatShortDate = (date: Date): string => {
  return format(date, 'EEE, MMM d');
};

export const getTimeFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

export const getDaysOfWeek = (dateStr: string | Date): Date[] => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getEventsForDay = (events: CalendarEvent[], day: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return isSameDay(eventDate, day);
  });
};

export const getEventPosition = (event: CalendarEvent): { top: number; height: number } => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  
  const startHour = startDate.getHours();
  const startMinute = startDate.getMinutes();
  const endHour = endDate.getHours();
  const endMinute = endDate.getMinutes();
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const duration = endMinutes - startMinutes;
  
  const top = (startMinutes / 60) * 48;
  const height = (duration / 60) * 48;
  
  return { top, height };
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const calculateDragDeltas = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  dayWidth: number
): { dayDelta: number; minuteDelta: number } => {
  // Calculate day change
  const dayDelta = Math.round((endX - startX) / dayWidth);
  
  const minuteDelta = Math.round((endY - startY) * 1.25);
  
  return { dayDelta, minuteDelta };
};

export const getInitialEventTimes = (
  day: Date, 
  hour: number, 
  minute: number
): { start: Date; end: Date } => {
  const start = new Date(day);
  start.setHours(hour, minute, 0, 0);
  
  const end = new Date(start);
  end.setHours(hour + 1, minute, 0, 0); 
  
  return { start, end };
};
