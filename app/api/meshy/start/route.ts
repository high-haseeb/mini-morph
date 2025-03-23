import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { image_url, enable_pbr, should_remesh, should_texture } = await req.json();

        const response = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.MESHY_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url,
                enable_pbr,
                should_remesh,
                should_texture,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to process image" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
