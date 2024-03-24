import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productName = searchParams.get("productName");
  if (!productName) {
    return new ImageResponse(<>No successful transaction found</>, {
      width: 1200,
      height: 630,
    });
  }

  const imageData = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_URL}/logo.png`, import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "white",
          background: "#855DCD",
          width: "100%",
          height: "100%",
          paddingTop: 20,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img width="200" height="200" src={imageData} />
        <p>Congrats! You&apos;ve successfully purchased the {productName}.</p>
        <p>
          Leave your email below to receive a link to complete your shipping
          details.
        </p>
        <p>Stay Based!</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
