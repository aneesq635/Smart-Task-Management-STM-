// app/api/tasks/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Adjust path if needed
import { validateTask } from "@/models/Task";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("mindsync"); // Your DB name
    const body = await req.json();

    // 1. Basic Validation
    const { isValid, errors } = validateTask(body);
    if (!isValid) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    // 2. Prepare the document
    const newTask = {
      ...body,
      status: "Pending",
      snoozeCount: 0,
      createdAt: new Date(),
    };

    // 3. Insert into MongoDB
    const result = await db.collection("tasks").insertOne(newTask);

    return NextResponse.json({ success: true, taskId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    const client = await clientPromise;
    const db = client.db("mindsync");
    
    // Fetch tasks and sort by newest first
    const tasks = await db.collection("tasks")
      .find({ userId })
      .sort({ createdAt: -1 }) 
      .toArray();

    return NextResponse.json(tasks);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}