import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseEther } from "viem";
import { baseSepolia } from "viem/chains";

import type { FrameTransactionResponse } from "@coinbase/onchainkit/frame";

async function getResponse(
  req: NextRequest,
  address: `0x${string}`
): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();

  const { isValid } = await getFrameMessage(body, {
    neynarApiKey: "NEYNAR_ONCHAIN_KIT",
  });

  console.log("isValid", isValid);

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to: address,
      value: parseEther("0.01").toString(), // 0.00004 ETH
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log("POST");
  const address = req.nextUrl.searchParams.get("address") as `0x${string}`;
  if (!address) {
    return new NextResponse("Address not found", { status: 400 });
  }
  return getResponse(req, address);
}

export const dynamic = "force-dynamic";
