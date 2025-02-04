import type { ITask } from "@/models/taskSchema"
import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { CalendarIcon, CheckCircleIcon, PlusCircleIcon } from "lucide-react"
import toast from "react-hot-toast"

interface TaskFormProps {
  task?: ITask | null
  onSubmit: (data: ITask) => void
}

interface TaskFormData {
  title: string
  description: string
  dueDate: string
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>()

  useEffect(() => {
    if (task && !task._id) {
      setValue("title", task.title || "")
      setValue("description", task.description)
      setValue("dueDate", new Date(task.dueDate).toISOString().split("T")[0])
    }
  }, [task, setValue])

  const handleFormSubmit = (data: TaskFormData) => {
    const taskData = {
      ...task,
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
    }

    onSubmit(taskData as ITask)
    toast.success("Task Added")
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {task ? "Update Task" : "Add New Task"}
        </motion.h2>

        <div className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              id="title"
              placeholder="Enter task title"
              className={`border-2 p-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <span className="text-sm text-red-500 mt-1">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              id="description"
              placeholder="Enter task description"
              rows={4}
              className={`border-2 p-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.description && <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                {...register("dueDate", { required: "Due date is required" })}
                id="dueDate"
                className={`border-2 p-3 pl-10 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.dueDate ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            {errors.dueDate && <span className="text-sm text-red-500 mt-1">{errors.dueDate.message}</span>}
          </div>
        </div>

        <div className="mt-8">
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {task ? (
              <>
                <CheckCircleIcon className="mr-2" size={20} />
                Update Task
              </>
            ) : (
              <>
                <PlusCircleIcon className="mr-2" size={20} />
                Add Task
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export default TaskForm

