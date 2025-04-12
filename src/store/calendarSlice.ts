
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent, DragInfo, Task, Goal } from '@/types/calendar';
import { addDays, addMinutes, format } from 'date-fns';

export interface CalendarState {
  events: CalendarEvent[];
  goals: Goal[];
  tasks: Task[];
  selectedGoal: string | null;
  filteredTasks: Task[];
  selectedDate: string;
  modalOpen: boolean;
  editingEvent: CalendarEvent | null;
  clickedTimeSlot: {
    day: Date; 
    hour: number;
    minute: number;
  } | null;
}

const serializeDate = (date: Date): string => {
  return date.toISOString();
};

const initialState: CalendarState = {
  events: [
    {
      id: '1',
      title: 'Morning Exercise',
      category: 'exercise',
      start: serializeDate(new Date(new Date().setHours(7, 0, 0, 0))),
      end: serializeDate(new Date(new Date().setHours(8, 0, 0, 0))),
    },
    {
      id: '2',
      title: 'Team Meeting',
      category: 'work',
      start: serializeDate(new Date(new Date().setHours(10, 0, 0, 0))),
      end: serializeDate(new Date(new Date().setHours(11, 30, 0, 0))),
    },
    {
      id: '3',
      title: 'Lunch Break',
      category: 'eating',
      start: serializeDate(addDays(new Date(new Date().setHours(12, 0, 0, 0)), 1)),
      end: serializeDate(addDays(new Date(new Date().setHours(13, 0, 0, 0)), 1)),
    },
    {
      id: '4',
      title: 'Family Dinner',
      category: 'family',
      start: serializeDate(addDays(new Date(new Date().setHours(18, 0, 0, 0)), 2)),
      end: serializeDate(addDays(new Date(new Date().setHours(19, 30, 0, 0)), 2)),
    },
    {
      id: '5',
      title: 'Quick Check-in',
      category: 'work',
      start: serializeDate(new Date(new Date().setHours(8, 15, 0, 0))),
      end: serializeDate(new Date(new Date().setHours(8, 30, 0, 0))),
    },
    {
      id: '6',
      title: '15-min Update',
      category: 'work',
      start: serializeDate(new Date(new Date().setHours(14, 0, 0, 0))),
      end: serializeDate(new Date(new Date().setHours(14, 15, 0, 0))),
    },
  ],
  goals: [
    { id: 'g1', title: 'Learn', color: '#9b87f5' },
    { id: 'g2', title: 'Health', color: '#65C466' },
    { id: 'g3', title: 'Personal', color: '#F97316' },
  ],
  tasks: [
    { id: 't1', title: 'AI based agents', goalId: 'g1', color: '#9b87f5' },
    { id: 't2', title: 'MLE', goalId: 'g1', color: '#9b87f5' },
    { id: 't3', title: 'DE related', goalId: 'g1', color: '#9b87f5' },
    { id: 't4', title: 'Basics', goalId: 'g1', color: '#9b87f5' },
    { id: 't5', title: 'Gym workout', goalId: 'g2', color: '#65C466' },
    { id: 't6', title: 'Meditation', goalId: 'g2', color: '#65C466' },
    { id: 't7', title: 'Reading', goalId: 'g3', color: '#F97316' },
    { id: 't8', title: 'Family time', goalId: 'g3', color: '#F97316' },
  ],
  selectedGoal: null,
  filteredTasks: [],
  selectedDate: serializeDate(new Date()),
  modalOpen: false,
  editingEvent: null,
  clickedTimeSlot: null,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = serializeDate(action.payload);
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    moveEvent: (state, action: PayloadAction<DragInfo>) => {
      const { event, dayDelta, minuteDelta } = action.payload;
      const index = state.events.findIndex(e => e.id === event.id);
      
      if (index !== -1) {
        const currentEvent = state.events[index];
        
        const start = new Date(currentEvent.start);
        const end = new Date(currentEvent.end);
        
        const newStart = addMinutes(addDays(start, dayDelta), minuteDelta);
        const newEnd = addMinutes(addDays(end, dayDelta), minuteDelta);
        
        state.events[index] = {
          ...currentEvent,
          start: serializeDate(newStart),
          end: serializeDate(newEnd),
        };
      }
    },
    openModal: (state, action: PayloadAction<{ day: Date; hour: number; minute: number } | null>) => {
      state.modalOpen = true;
      state.clickedTimeSlot = action.payload;
      state.editingEvent = null;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.editingEvent = null;
      state.clickedTimeSlot = null;
    },
    editEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.editingEvent = action.payload;
      state.modalOpen = true;
    },
    selectGoal: (state, action: PayloadAction<string>) => {
      state.selectedGoal = action.payload;
      state.filteredTasks = state.tasks.filter(task => task.goalId === action.payload);
    },
    createEventFromTask: (state, action: PayloadAction<{ 
      taskId: string; 
      day: Date; 
      hour: number; 
      minute: number 
    }>) => {
      const { taskId, day, hour, minute } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      
      if (task) {
        state.clickedTimeSlot = { day, hour, minute };
        state.modalOpen = true;
        
        const startTime = new Date(day);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, minute, 0, 0);
        
        state.editingEvent = {
          id: '',
          title: task.title,
          category: 'work', 
          start: serializeDate(startTime),
          end: serializeDate(endTime),
          color: task.color 
        };
      }
    },
  },
});

export const {
  setSelectedDate,
  addEvent,
  updateEvent,
  deleteEvent,
  moveEvent,
  openModal,
  closeModal,
  editEvent,
  selectGoal,
  createEventFromTask,
} = calendarSlice.actions;

export default calendarSlice.reducer;
