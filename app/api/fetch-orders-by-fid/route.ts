import db from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  if (!fid) {
    return { status: 400, body: "Missing fid" };
  }

  const orders = await db.order.findMany({
    where: {
      purchasedBy: parseInt(fid),
    },
  });

  return Response.json({ orders });
}
