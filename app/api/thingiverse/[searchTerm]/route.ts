import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params } : { params: Promise<{ searchTerm: string }> }) {
    const { searchTerm } = await params;

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    try {
        const response = await fetch(
            `https://api.thingiverse.com/search/${encodeURIComponent(searchTerm)}/?type=things&page=${page}&per_page=4`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.THINGIVERSE_API_KEY}`,
                    "User-Agent": "MiniMorph/1.0"
                },
            }
        );

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Can not send request to thingiverse!" }), { status: response.status });
        }
        return new Response(response.body, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
