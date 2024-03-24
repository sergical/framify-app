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
  const shopUrl = state?.shop || "";
  const fid = state?.fid || "";
  const name = state?.name || "";
  const transactionId = state?.transactionId || "";
  const frameId = state?.frameId || 0;

  const userAddress = await getFarcasterUserAddress(fid, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  await db.order.create({
    data: {
      frameId: frameId,
      shopUrl: shopUrl,
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
