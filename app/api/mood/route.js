import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("mindsync");
    const { userId, mood, note } = await req.json();

    const moodEntry = {
      userId,
      mood, // "good", "okay", "low"
      note: note || "",
      timestamp: new Date(),
    };

    const result = await db.collection("mood_logs").insertOne(moodEntry);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 });
  }
}