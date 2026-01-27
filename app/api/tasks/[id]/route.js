
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("mindsync");

    if (updates._id) delete updates._id;

    // Check if task is being marked as completed
    if (updates.status === "Completed") {
      // First, get the full task data
      const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
      
      if (task) {
        // Save to completedTasks collection
        const completedTask = {
          ...task,
          ...updates,
          completedAt: new Date(),
          originalTaskId: id
        };
        
        await db.collection("completedTasks").insertOne(completedTask);
        console.log(`Task ${id} saved to completedTasks collection`);
      }
    }

    // Update the original task
    const result = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("mindsync");

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}