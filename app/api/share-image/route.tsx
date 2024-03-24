import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <img
          width="256"
          height="256"
          src={`https://github.com/${username}.png`}
          style={{
            borderRadius: 128,
          }}
        /> */}
        <p>Wait for an email to complete your shipping details</p>
        <p>
          Meanwhile, share with your friends to get a discount on your next
          purchase.
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