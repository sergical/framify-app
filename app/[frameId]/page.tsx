// Step 1. import getFrameMetadata from @coinbase/onchainkit
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import db from "@/server/db";

import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: { frameId: string };
};

async function getData(frameId: number) {
  return await db.frame.findFirst({ where: { id: frameId } });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { frameId } = params;
  const id = parseInt(frameId);
  const frame = await getData(id);
  if (!frame) {
    return {
      title: "Frame not found",
    };
  }

  // Step 2. Use getFrameMetadata to shape your Frame metadata
  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: "Checkout with Shopify",
        action: "link",
        target: frame.checkoutUrl,
      },
      {
        label: "Buy with Base",
        action: "tx",
        target: `${process.env.NEXT_PUBLIC_URL}/api/tx?frameId=${frame.id}&address=${frame.address}`,
        postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-success`,
      },
    ],
    state: {
      frameId: frame.id,
      name: frame.name,
      shop: frame.shop,
      fid: frame.fid,
    },
    image: {
      aspectRatio: "1:1",
      src: frame.imageUrl,
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Buy ${frame.name} on framify.xyz | Stay Based`,
    openGraph: {
      images: [frame.imageUrl, ...previousImages],
    },
    other: {
      ...frameMetadata,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { frameId } = params;
  const id = parseInt(frameId);
  const frameData = await getData(id);
  if (!frameData) {
    notFound();
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full sm:w-[360px]">
        <h1>{frameData?.name}</h1>
        <Image
          src={frameData?.imageUrl}
          alt={frameData?.name}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}
