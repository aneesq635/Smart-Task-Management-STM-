import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("mindsync");

  return Response.json({ message: "MongoDB connected successfully" });
}
