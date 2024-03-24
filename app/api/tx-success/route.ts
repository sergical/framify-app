import { NEXT_PUBLIC_URL } from "@/app/config";
import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit/frame";

import { NextRequest, NextResponse } from "next/server";
import { baseSepolia } from "viem/chains";

export const dynamic = "force-dynamic";

// state: {
//   frameId: frame.id,
//   name: frame.name,
//   shop: frame.shop,
//   fid: frame.fid,
// },

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }

  let state = {} as any;
  try {
    state = JSON.parse(decodeURIComponent(message?.state?.serialized || ""));
  } catch (e) {
    console.error(e);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      input: {
        text: "Leave your email address",
      },
      buttons: [
        {
          label: `View transaction`,
          action: "link",
          target: `${baseSepolia.blockExplorers.default.url}/${body?.untrustedData?.transactionId}`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/success-image?`,
      },
      state: {
        ...state,
        transactionId: body?.untrustedData?.transactionId,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/email-address`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
