import { NEXT_PUBLIC_URL } from "@/app/config";
import { convertToSlug } from "@/lib/utils";
import { fdk } from "@/server/pinata";
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

  const productName = req.nextUrl.searchParams.get("productName");

  const frameId = req.nextUrl.searchParams.get("frameId");
  const shop = req.nextUrl.searchParams.get("shop");
  const fid = req.nextUrl.searchParams.get("fid");
  const { isValid } = await getFrameMessage(body);

  const friendlyName = convertToSlug(productName || "frame");
  const frame_id = `${frameId}-${friendlyName}`;
  try {
    await fdk.sendAnalytics(frame_id, body as any, "tx-success");
  } catch (error) {
    console.error("Error sending analytics", error);
  }

  if (!isValid) {
    return new NextResponse("Message not valid", { status: 500 });
  }
  return new NextResponse(
    getFrameHtmlResponse({
      input: {
        text: "Leave your email address",
      },
      buttons: [
        {
          label: "Submit",
        },
        {
          label: `View transaction`,
          action: "link",
          target: `${baseSepolia.blockExplorers.default.url}/tx/${body?.untrustedData?.transactionId}`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/success-image?productName=${productName}`,
      },
      state: {
        transactionId: body?.untrustedData?.transactionId,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/email-address?frameId=${frameId}&shop=${shop}&fid=${fid}&productName=${productName}`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
