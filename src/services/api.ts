
import axios from 'axios';
import { CalendarEvent, Goal, Task } from '@/types/calendar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Events API
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await api.get('/events');
  return response.data;
};

export const fetchEventsByDateRange = async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
  const response = await api.get(`/events/range?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  const response = await api.post('/events', event);
  return response.data;
};

export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const response = await api.put(`/events/${event.id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};

// Goals API
export const fetchGoals = async (): Promise<Goal[]> => {
  const response = await api.get('/goals');
  return response.data;
};

export const createGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  const response = await api.post('/goals', goal);
  return response.data;
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
  const response = await api.put(`/goals/${goal.id}`, goal);
  return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

// Tasks API
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const fetchTasksByGoal = async (goalId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/goal/${goalId}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await api.put(`/tasks/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export default api;
