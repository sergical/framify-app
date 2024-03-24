import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";

import type { FrameTransactionResponse } from "@coinbase/onchainkit/frame";

// state: {
//   frameId: frame.id,
//   name: frame.name,
//   shop: frame.shop,
//   fid: frame.fid,
// },

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const frameId = req.nextUrl.searchParams.get("frameId");
  const address = req.nextUrl.searchParams.get("address") as `0x${string}`;

  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }
  let state = {};
  try {
    state = JSON.parse(decodeURIComponent(message?.state?.serialized || ""));
  } catch (e) {
    console.error(e);
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
  return NextResponse.json({ txData, frameId });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
