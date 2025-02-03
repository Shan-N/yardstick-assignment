import { ITask } from '@/models/taskSchema';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskListProps {
  tasks: ITask[];
  onDelete: (id: string) => void;
  onUpdate: (updatedTask: ITask) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate }) => {
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<ITask>>({});

  const handleEditClick = (task: ITask) => {
    setEditTaskId(task._id);
    setEditedTask({ ...task });
  };

  const handleSave = async () => {
    if (editTaskId) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editTaskId, updates: editedTask }),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          onUpdate(updatedTask);
          setEditTaskId(null);
        } else {
          console.error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleToggleComplete = async (task: ITask) => {
    try {
      const updatedStatus = !task.isCompleted;
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: task._id, updates: { isCompleted: updatedStatus } }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask);
      } else {
        console.error('Failed to toggle completion');
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 grid gap-4">
      {tasks.map((task) => (
        <motion.div 
          key={task._id.toString()} 
          className="bg-white shadow-md rounded-lg p-4 transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          {editTaskId === task._id ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={new Date(editedTask.dueDate || '').toISOString().substr(0, 10)}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditTaskId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(task)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleComplete(task)}
                  disabled={task.isCompleted}
                  className={`px-4 py-2 rounded-lg ${task.isCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {task.isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => onDelete(task._id.toString())}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;