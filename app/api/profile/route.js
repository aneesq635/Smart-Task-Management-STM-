import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { mapOnboardingToProfile } from "@/lib/profileMapper";

// GET: Used by Dashboard to load your traits
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db("mindsync");

    // We look in users_onboarding because that is where your data is
    const profile = await db.collection("users_onboarding").findOne({ userId });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: Added this because your onboarding page tries to POST to /api/profile
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("mindsync");
    const { userId, answers } = await req.json();

    const processed = mapOnboardingToProfile(answers);

    await db.collection("users_onboarding").updateOne(
      { userId },
      { $set: { ...processed, answers, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}