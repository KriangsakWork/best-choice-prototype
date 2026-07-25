import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #ff9a4d 0%, #f4511e 48%, #eb3b0c 100%)"
        }}
      >
        <svg width="118" height="118" viewBox="0 0 118 118">
          <circle cx="51" cy="49" r="28" fill="none" stroke="white" strokeWidth="8" />
          <path d="M71 69 96 94" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path
            d="m38 49 9 9 18-21"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
