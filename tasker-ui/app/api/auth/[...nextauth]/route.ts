export async function GET() {
  return Response.json({ ok: true, mode: "mock-auth", message: "AITasker uses in-memory auth in /login." });
}

export async function POST() {
  return Response.json({ ok: true, mode: "mock-auth" });
}
