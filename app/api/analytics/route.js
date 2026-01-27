import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("Analytics request for userID:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("mindsync");

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago to today
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyData = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        // Count scheduled tasks (created on this day)
        const scheduled = await db.collection("tasks").countDocuments({
          userId,
          createdAt: {
            $gte: date,
            $lt: nextDay,
          },
        });

        // Count completed tasks (completed on this day)
        const completed = await db.collection("completedTasks").countDocuments({
          userId,
          completedAt: {
            $gte: date,
            $lt: nextDay,
          },
        });

        return {
          name: dayNames[date.getDay()],
          date: date.toISOString().split("T")[0],
          scheduled,
          completed,
        };
      }),
    );

    const totalScheduled = weeklyData.reduce(
      (sum, day) => sum + day.scheduled,
      0,
    );
    const totalCompleted = weeklyData.reduce(
      (sum, day) => sum + day.completed,
      0,
    );
    const completionRate =
      totalScheduled > 0
        ? Math.round((totalCompleted / totalScheduled) * 100)
        : 0;

    // Get total focus time (sum of estimate minutes from completed tasks in last 7 days)
    const sevenDaysAgo = last7Days[0];
    const completedTasksWithTime = await db
      .collection("completedTasks")
      .find({
        userId,
        completedAt: { $gte: sevenDaysAgo },
      })
      .toArray();

    const totalFocusMinutes = completedTasksWithTime.reduce(
      (sum, task) => sum + (task.estimateMinutes || 0),
      0,
    );
    const focusHours = (totalFocusMinutes / 60).toFixed(1);

    // Calculate best streak (consecutive days with at least 1 completed task)
    let currentStreak = 0;
    let bestStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      // Check last 30 days for streak
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const nextDate = new Date(checkDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const hasCompleted =
        (await db.collection("completedTasks").countDocuments({
          userId,
          completedAt: {
            $gte: checkDate,
            $lt: nextDate,
          },
        })) > 0;

      if (hasCompleted) {
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }

    return NextResponse.json({
      weeklyData,
      stats: {
        completionRate: `${completionRate}%`,
        tasksFinished: totalCompleted,
        focusTime: `${focusHours}h`,
        bestStreak: `${bestStreak} Days`,
        trend: {
          completionRate: completionRate >= 80 ? "+4.5%" : "-2.1%",
          tasksFinished: totalCompleted > 50 ? "+12" : "+5",
          focusTime: focusHours > 20 ? "+2h" : "+0.5h",
          bestStreak: bestStreak >= 7 ? "Improving" : "Steady",
        },
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
