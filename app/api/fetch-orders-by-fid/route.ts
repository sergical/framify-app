import db from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  if (!fid) {
    throw new Error("No fid provided");
  }

  const orders = await db.order.findMany({
    where: {
      purchasedBy: parseInt(fid),
    },
  });

  return Response.json({ orders });
}
