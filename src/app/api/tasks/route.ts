import { NextResponse } from "next/server";
import Task from "@/models/taskSchema";
import { connect } from "@/dbConfig/db";
import { ITask } from "@/models/taskSchema";

connect();
export async function GET() {
  try {
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
    return NextResponse.json({error});
  }
}

export async function POST(req: Request) {
  const { title, description, dueDate }: ITask = await req.json();

  try {
    const newTask = new Task({ title, description, dueDate });
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
    return NextResponse.json({error})
  }
}

export async function PUT(req: Request) {
  const { id, updates }: { id: string; updates: ITask } = await req.json();

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
    return NextResponse.json({error});
  }
}

export async function DELETE(req: Request) {
  const { taskId }: { taskId: string } = await req.json();

  try {
    await Task.findByIdAndDelete(taskId);
    return NextResponse.json({ message: 'Task deleted' }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
    return NextResponse.json({error});
  }
}