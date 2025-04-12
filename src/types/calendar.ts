
export type EventCategory = 'exercise' | 'eating' | 'work' | 'relax' | 'family' | 'social';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  start: string;
  end: string; 
  color?: string; 
}

export interface DragInfo {
  event: CalendarEvent;
  dayDelta: number;
  minuteDelta: number;
}

export interface Goal {
  id: string;
  title: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  goalId: string;
  color: string;
}
