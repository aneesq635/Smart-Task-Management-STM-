import { NextResponse } from "next/server";
import clientPromise  from "../../../../lib/Client_Promise";

export async function GET(request, { params }) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try{
    const client = await clientPromise;
    const db = client.db('mindsync');
    const reminders = await db
      .collection('reminders')
      .find({ userId })
      .sort({ priority: 1, date: 1, time: 1 })
      .toArray();

    return NextResponse.json(reminders);
  }
  catch(error){
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }



}
