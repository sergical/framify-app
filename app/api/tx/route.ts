import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";

import type { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { fdk } from "@/server/pinata";
import { convertToSlug } from "@/lib/utils";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const frameId = req.nextUrl.searchParams.get("frameId");
  const address = req.nextUrl.searchParams.get("address") as `0x${string}`;
  const productName = req.nextUrl.searchParams.get("productName");

  if (!frameId || !address) {
    return new NextResponse("Missing frameId or address", { status: 400 });
  }
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }

  const friendlyName = convertToSlug(productName || "frame");
  const frame_id = `${frameId}-${friendlyName}`;

  try {
    await fdk.sendAnalytics(frame_id, body as any, "tx");
  } catch (error) {
    console.error("Error sending analytics", error);
  }

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to: address,
      value: parseEther("0.001").toString(), // TODO get product price
    },
  };

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
