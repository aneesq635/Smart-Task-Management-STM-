import { NextResponse } from 'next/server';
import  clientPromise  from '../../../../lib/Client_Promise';
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, priority, date, time, userId } = body;

    if (!title || !date || !time || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('mindsync');
    
    const newReminder = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      priority: priority || 2,
      date,
      time,
      userId,
      createdAt: Date.now()
    };

    await db.collection('reminders').insertOne(newReminder);

    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}