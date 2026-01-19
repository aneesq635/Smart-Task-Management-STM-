import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { mapOnboardingToProfile } from "../../../lib/profileMapper";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("mindsync");
    const { userId, email, answers } = await request.json();

    if (!userId || !answers) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Generate the Intelligence Traits from the answers
    const processedProfile = mapOnboardingToProfile(answers);

    // 2. Save EVERYTHING to users_onboarding (to keep it in one place as you requested)
    const result = await db.collection("users_onboarding").updateOne(
      { userId: userId },
      {
        $set: {
          email,
          answers,
          traits: processedProfile.traits,
          patterns: processedProfile.patterns,
          interaction: processedProfile.interaction,
          completedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}