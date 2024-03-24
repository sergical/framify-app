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
    `https://api.pinata.cloud/v3/farcaster/users/${fid}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );

  // "data": {
  //   "bio": "Writer. Building @pinatacloud. Tinkering with a Farcaster native alternative to GoodReads: https://readcast.xyz \\ https://polluterofminds.com",
  //   "custody_address": "0x7f9a6992a54dc2f23f1105921715bd61811e5b71",
  //   "display_name": "Justin Hunter",
  //   "fid": 4823,
  //   "follower_count": 11049,
  //   "following_count": 811,
  //   "pfp_url": "https://i.seadn.io/gae/lhGgt7yK1JiBVYz_HBxcAmYLRtP03aw5xKX4FgmFT9Ai7kLD5egzlLvb0lkuRNl28shtjr07DC8IHzLUkTqlWUMndUzC9R5_MSxH3g?w=500&auto=format",
  //   "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
  //   "username": "polluterofminds",
  //   "verifications": [
  //     "0x1612c6dff0eb5811108b709a30d8150495ce9cc5",
  //     "0xcdcdc174901b12e87cc82471a2a2bd6181c89392"
  //   ]
  // }

  const json = await res.json();
  if (!json) {
    return new NextResponse("No user found", { status: 500 });
  }
  const userAddress = json?.data?.username || "";
  const followers = json?.data?.follower_count || 0;

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
        src: `${NEXT_PUBLIC_URL}/api/share-image?followerCount=${followers}&username=${userAddress}`,
      },
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
