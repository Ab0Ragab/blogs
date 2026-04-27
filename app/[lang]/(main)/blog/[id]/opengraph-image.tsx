import { ImageResponse } from "next/og";
import { getPost } from "./page";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {post?.title ?? "Post not found"}
    </div>,
  );
}
