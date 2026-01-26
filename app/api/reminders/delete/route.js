import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/Client_Promise";
export async function DELETE(request){
   const {searchParams} = new URL(request.url);
   const id = searchParams.get("id");
    if (!id) {
    return NextResponse.json({ error: "Reminder ID is required" }, { status: 400 });
    }
    try{
    const client = await clientPromise;
    const db = client.db('mindsync');
    const result = await db
      .collection('reminders')
      .deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Reminder deleted successfully" });
    }
    catch(error){
      return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
    }
}