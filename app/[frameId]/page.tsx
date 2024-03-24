// Step 1. import getFrameMetadata from @coinbase/onchainkit
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import db from "@/server/db";

import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import GenericProducts from "@/components/generic-products";

type Props = {
  params: { frameId: string };
};

async function getData(frameId: number) {
  if (!frameId) return null;
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
        target: `${process.env.NEXT_PUBLIC_URL}/api/tx?frameId=${frame.id}&address=${frame.address}&productName=${frame.name}`,
        postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-success?productName=${frame.name}&frameId=${frame.id}&shop=${frame.shop}&fid=${frame.fid}`,
      },
    ],
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {frameData.name}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">
                ${frameData.price}
              </p>

              <div className="ml-4 border-l border-gray-300 pl-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="ml-2 text-sm text-gray-500">
                    100 purchases from 124 Farcaster users
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center">
              <p className="text-sm text-purple-600 mb-6">
                @vitalik.eth purchased this product 28 minutes ago
              </p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <Image
              src={frameData.imageUrl}
              alt={frameData.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product form */}
        <div className="lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>

            <div className="border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Share</h3>
              <ul role="list" className="mt-4 flex items-center space-x-6">
                <li>
                  <a
                    href="#"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on Facebook</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Share on X</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href={`https://warpcast.com/~/compose?text=Check%20out%20${frameData.name}%20from%20@sergiy%20on%20https://framify.xyz%20!%20Or%20purchase%20right%20here&embeds[]=${process.env.NEXT_PUBLIC_URL}/${frameId}
                    `}
                    target="_blank"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <Image
                      src="/farcaster.jpeg"
                      alt={frameData.name}
                      className="rounded-full h-5 w-5"
                      width={20}
                      height={20}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href={`https://xmtp.chat/inbox`}
                    target="_blank"
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500 border border-orange-500 rounded-full"
                  >
                    <Image
                      src="/xmtp.jpeg"
                      alt={frameData.name}
                      className="rounded-full h-5 w-5 "
                      width={20}
                      height={20}
                    />
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-10 space-y-2">
              <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                Checkout on Shopify
              </button>
              <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                Checkout on Coinbase Commerce
              </button>
              <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Customers also purchased
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <GenericProducts />
          </div>
        </div>
      </div>
    </div>
  );
}
