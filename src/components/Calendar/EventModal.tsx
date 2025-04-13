
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addEvent, updateEvent, deleteEvent, closeModal } from '@/store/calendarSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { CalendarEvent, EventCategory } from '@/types/calendar';
import { generateUniqueId, getInitialEventTimes } from '@/lib/calendarUtils';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const EventModal: React.FC = () => {
  const dispatch = useDispatch();
  const { modalOpen, editingEvent, clickedTimeSlot } = useSelector((state: RootState) => state.calendar);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('work');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [customColor, setCustomColor] = useState<string>('#9b87f5');
  
  // Get category colors
  const getCategoryColor = (cat: EventCategory): string => {
    switch(cat) {
      case 'exercise': return '#65C466';
      case 'eating': return '#F97316';
      case 'work': return '#9b87f5';
      case 'relax': return '#38BDF8';
      case 'family': return '#EC4899';
      case 'social': return '#8B5CF6';
      default: return '#9b87f5';
    }
  };
  
  useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.start);
      const endDate = new Date(editingEvent.end);
      
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      setDate(format(startDate, 'yyyy-MM-dd'));
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(endDate, 'HH:mm'));
      setCustomColor(editingEvent.color || getCategoryColor(editingEvent.category));
    } else if (clickedTimeSlot) {
      const { day, hour, minute } = clickedTimeSlot;
      const { start, end } = getInitialEventTimes(day, hour, minute);
      
      setTitle('');
      setCategory('work');
      setDate(format(day, 'yyyy-MM-dd'));
      setStartTime(format(start, 'HH:mm'));
      setEndTime(format(end, 'HH:mm'));
      setCustomColor(getCategoryColor('work'));
    }
  }, [editingEvent, clickedTimeSlot]);
  
  useEffect(() => {
    if (!editingEvent?.color) {
      setCustomColor(getCategoryColor(category));
    }
  }, [category, editingEvent]);
  
  const handleClose = () => {
    dispatch(closeModal());
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(`${date}T${startTime}`);
    const endDate = new Date(`${date}T${endTime}`);
    
    if (editingEvent) {
      const updatedEvent: CalendarEvent = {
        ...editingEvent,
        title,
        category,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        color: customColor
      };
      dispatch(updateEvent(updatedEvent));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: generateUniqueId(),
        title,
        category,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        color: customColor
      };
      dispatch(addEvent(newEvent));
    }
    
    dispatch(closeModal());
  };
  
  const handleDelete = () => {
    if (editingEvent) {
      dispatch(deleteEvent(editingEvent.id));
      dispatch(closeModal());
    }
  };
  
  const ColorDisplay = () => (
    <div 
      className="w-8 h-8 rounded-full border border-gray-300" 
      style={{ backgroundColor: customColor }}
    />
  );
  
  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="border-gray-300"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={(val: EventCategory) => setCategory(val)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#65C466] mr-2"></div>
                  Exercise
                </SelectItem>
                <SelectItem value="eating" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#F97316] mr-2"></div>
                  Eating
                </SelectItem>
                <SelectItem value="work" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#9b87f5] mr-2"></div>
                  Work
                </SelectItem>
                <SelectItem value="relax" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#38BDF8] mr-2"></div>
                  Relax
                </SelectItem>
                <SelectItem value="family" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#EC4899] mr-2"></div>
                  Family
                </SelectItem>
                <SelectItem value="social" className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></div>
                  Social
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-sm font-medium">Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 flex items-center gap-2"
                >
                  <ColorDisplay />
                  <span>{customColor}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={customColor} onChange={setCustomColor} />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-gray-300"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-gray-300"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-gray-300"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <div className="flex justify-between w-full">
              {editingEvent && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
