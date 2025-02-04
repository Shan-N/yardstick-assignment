
import type { ITask, IToggle } from "@/models/taskSchema"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from "lucide-react"
import toast from "react-hot-toast"

interface TaskListProps {
  tasks: ITask[]
  onDelete: (id: string) => void
  onUpdate: (updatedTask: ITask) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate }) => {
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [editedTask, setEditedTask] = useState<{
    _id: string | null
    title: string
    description: string
    dueDate: Date
  }>({
    _id: "",
    title: "",
    description: "",
    dueDate: new Date(),
  })

  const handleEditClick = (task: ITask) => {
    setEditTaskId(task._id as string)
    setEditedTask({ ...task })
  }

  const handleSave = async () => {
    if (editTaskId) {
      try {
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editTaskId, updates: editedTask }),
        })

        if (response.ok) {
          const updatedTask = await response.json()
          onUpdate(updatedTask)
          setEditTaskId(null)
          toast.success("Task updated")
        } else {
          console.error("Failed to update task")
        }
      } catch (error) {
        console.error("Error updating task:", error)
      }
    }
  }

  const handleToggleComplete = async (task: IToggle) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted }

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: task._id, updates: updatedTask }),
      })

      if (response.ok) {
        const updatedTaskFromServer = await response.json()
        onUpdate(updatedTaskFromServer)
        toast.success(`Marked as ${updatedTask.isCompleted ? "complete" : "incomplete"}`);
      } else {
        console.error("Failed to toggle completion")
      }
    } catch (error) {
      console.error("Error toggling completion:", error)
    }
  }

  // Check if tasks is undefined or not an array
  if (!tasks || !Array.isArray(tasks)) {
    return <div className="text-center text-gray-500 mt-4">No tasks available</div>
  }

  return (

    <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id!.toString()}
            className={`bg-white shadow-lg rounded-xl p-6 mb-4 transition-all duration-300 ease-in-out ${task.isCompleted ? "opacity-70" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {editTaskId === task._id ? (
              <div className="flex flex-col gap-4 text-black">
                <input
                  type="text"
                  value={editedTask.title || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Task title"
                />
                <textarea
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="border-2 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Task description"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-gray-500" />
                  <input
                    type="date"
                    value={new Date(editedTask.dueDate || "").toISOString().substr(0, 10)}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
                    className="border-2 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <CheckCircleIcon size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditTaskId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-300 flex items-center gap-2"
                  >
                    <XCircleIcon size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-xl font-semibold ${task.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}
                  >
                    {task.title}
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-gray-600 mb-4 ${task.isCompleted ? "line-through" : ""}`}>{task.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <PencilIcon size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`px-4 py-2 rounded-lg ${task.isCompleted ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white transition-colors duration-300 flex items-center gap-2`}
                  >
                    <CheckCircleIcon size={18} />
                    {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => onDelete(task._id!.toString())}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <TrashIcon size={18} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList

