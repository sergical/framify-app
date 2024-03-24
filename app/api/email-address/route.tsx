import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";
import { getFarcasterUserAddress } from "@coinbase/onchainkit/farcaster";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_URL } from "../../config";
import db from "@/server/db";

// state: {
//   frameId: frame.id,
//   name: frame.name,
//   shop: frame.shop,
//   fid: frame.fid,
// },

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const frameId = parseInt(req.nextUrl.searchParams.get("frameId") || "");
  const shop = req.nextUrl.searchParams.get("shop");
  const fid = parseInt(req.nextUrl.searchParams.get("fid") || "");
  const name = req.nextUrl.searchParams.get("productName") || "";

  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (!message) {
    return new NextResponse("Message not present", { status: 500 });
  }

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }

  const emailAddress = message.input || "";
  const purchasedBy = message.interactor.fid || 0;

  let state = {} as any;
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  const transactionId = state?.transactionId || "";

  const res = await fetch(
    `https://fnames.farcaster.xyz/transfers/current?fid=${fid}`
  );

  const data = await res.json();
  if (!data) {
    return new NextResponse("No user found", { status: 500 });
  }
  const userAddress = data.transfer.username;

  await db.order.create({
    data: {
      frameId: frameId,
      shopUrl: shop || "",
      emailAddress: emailAddress,
      purchasedBy,
      timePlaced: new Date(),
      transactionId,
    },
  });

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Share with frens`,
          action: "link",
          target: `https://warpcast.com/~/compose?text=I%20just%20bought%20a%20${name}%20from%20@${userAddress}%20You%20should%20too!&embeds[]=${process.env.NEXT_PUBLIC_URL}/${frameId}
          `,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/share-image`,
      },
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
