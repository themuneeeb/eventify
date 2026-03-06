import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Simple secret check for external callers
    if (secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: "path",
        value: path,
        now: Date.now(),
      });
    }

    if (tag) {
      revalidateTag(tag, "max");
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        value: tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Please provide a path or tag to revalidate" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
