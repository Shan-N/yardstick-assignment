import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string | null;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}

export interface IToggle extends Document {
  _id: string | null;
  isCompleted: boolean;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
});

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
export default Task;
