import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


// GET ---> get all videos
export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({
      error: "failed to fetch the videos",
    });
  }
}

// POST ---> create new video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "unauthorized",
        },
        { status: 500 }
      );
    } // authentication done

    // session hai now connect to databse
    await connectToDatabase();

    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }
    // creating video data
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100
      }
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo)
  } catch (error) {
    return NextResponse.json({ error: "failed to create video"} , {status: 500})
  }
}
