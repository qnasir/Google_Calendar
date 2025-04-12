
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { selectGoal, createEventFromTask } from '@/store/calendarSlice';
import { Task, Goal } from '@/types/calendar';

const TaskSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { goals, filteredTasks, selectedGoal } = useSelector((state: RootState) => state.calendar);
  
  const handleGoalClick = (goalId: string) => {
    dispatch(selectGoal(goalId));
  };
  
  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  return (
    <div className="task-sidebar bg-gray-50 border-r border-gray-200 p-4 w-64 flex-shrink-0">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Goals</h3>
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-2 rounded cursor-pointer flex items-center transition-colors ${
                selectedGoal === goal.id ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleGoalClick(goal.id)}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: goal.color }}
              ></div>
              <span>{goal.title}</span>
            </div>
          ))}
        </div>
      </div>
      
      {selectedGoal && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Tasks</h3>
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-2 rounded cursor-move bg-white border border-gray-200 hover:shadow-sm"
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task.id)}
                style={{ borderLeftWidth: '4px', borderLeftColor: task.color }}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSidebar;
