import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const followerCount = searchParams.get("followerCount");
  const username = searchParams.get("username");
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
        <p>Thanks for your purchase @{username}</p>
        <p>Wait for an email to complete your shipping details</p>
        <p>
          Meanwhile, share with your{" "}
          {parseInt(followerCount || "").toLocaleString()} frens on Warpcast!
        </p>
        <p>Don&apos;t forget to post it to the /framify channel.</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
