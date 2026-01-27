import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST - Save completed task
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("mindsync");
    const body = await req.json();

    // Prepare completed task document
    const completedTask = {
      ...body,
      completedAt: new Date(),
      // Keep all original task data
    };

    // Insert into completedTasks collection
    const result = await db.collection("completedTasks").insertOne(completedTask);

    return NextResponse.json({ 
      success: true, 
      completedTaskId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving completed task:", error);
    return NextResponse.json({ 
      error: "Failed to save completed task" 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit")) || 50;

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required" 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mindsync");
    
    // Fetch completed tasks sorted by completion date (newest first)
    const completedTasks = await db.collection("completedTasks")
      .find({ userId })
      .sort({ completedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(completedTasks);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return NextResponse.json({ 
      error: "Failed to fetch completed tasks" 
    }, { status: 500 });
  }
}
