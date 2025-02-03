'use client';

import { ITask } from '@/models/taskSchema';
import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const Home = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskSubmit = async (task: ITask) => {
    try {
      const res = selectedTask
        ? await fetch('/api/tasks', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: selectedTask._id, updates: task }),
          })
        : await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
          });

      await res.json();
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: id }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTaskStatus = async (id: string) => {
    try {
      const task = tasks.find((t:ITask) => t._id.toString() === id);
      if (task) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, updates: updatedTask }),
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="text-2xl text-fuchsia-500 text-center">Task Management</div>
      <TaskForm task={selectedTask ?? undefined} onSubmit={handleTaskSubmit} />
      <TaskList tasks={tasks} onDelete={handleTaskDelete} onUpdate={handleUpdateTaskStatus} />
    </div>
  );
};

export default Home;
