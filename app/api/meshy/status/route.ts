import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get("taskId");

        if (!taskId) {
            return NextResponse.json({ error: "Missing taskId parameter" }, { status: 400 });
        }

        const response = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.MESHY_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch model status" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
