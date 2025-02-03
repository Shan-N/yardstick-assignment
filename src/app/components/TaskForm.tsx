import { ITask } from '@/models/taskSchema';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface TaskFormProps {
  task?: ITask | null;
  onSubmit: (data: ITask) => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string; // or Date if preferred
}


const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TaskFormData>();

  useEffect(() => {
    if (task && !task._id) {
      setValue('title', task.title || '');
      setValue('description', task.description);
      setValue('dueDate', task.dueDate.toString());
    }
  }, [task, setValue]);

  const handleFormSubmit = (data: TaskFormData) => {
    const taskData = {
      ...task, // Keep existing properties from the original task if updating
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
    };
  
    onSubmit(taskData as ITask);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-semibold text-center mb-6 text-black"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {task ? 'Update Task' : 'Add Task'}
      </motion.h2>

      <div className="flex flex-col mb-4">
        <label htmlFor="title" className="text-lg font-medium mb-2">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          id="title"
          placeholder="Enter task title"
          className={`border-2 p-3 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title && <span className="text-sm text-red-500 mt-1">{errors.title.message}</span>}
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="description" className="text-lg font-medium mb-2">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          id="description"
          placeholder="Enter task description"
          className={`border-2 p-3 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>}
      </div>

      <div className="flex flex-col mb-6">
        <label htmlFor="dueDate" className="text-lg font-medium mb-2">Due Date</label>
        <input
          type="date"
          {...register('dueDate', { required: 'Due date is required' })}
          id="dueDate"
          className={`border-2 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.dueDate && <span className="text-sm text-red-500 mt-1">{errors.dueDate.message}</span>}
      </div>

      <div className="flex justify-center">
        <motion.button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {task ? 'Update Task' : 'Add Task'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
