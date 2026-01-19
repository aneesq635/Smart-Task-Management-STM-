import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { validateEvent } from "@/models/BehavioralEvent";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. Validate
    const { isValid, errors } = validateEvent(body);
    if (!isValid) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mindsync");

    // 2. Enrich and Insert
    const event = {
      ...body,
      timestamp: new Date(),
      metadata: {
        hourOfDay: new Date().getHours(),
        isWeekend: [0, 6].includes(new Date().getDay())
      }
    };

    await db.collection("behavioral_events").insertOne(event);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("Logging Error:", e);
    // Even if logging fails, we often return 200/201 to the client 
    // so the UI doesn't crash just because a log failed.
    return NextResponse.json({ error: "Silent failure" }, { status: 500 });
  }
}