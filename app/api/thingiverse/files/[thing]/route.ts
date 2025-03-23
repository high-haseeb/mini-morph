import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params } : { params: Promise<{ thing: string }> }) {
    const { thing } = await params;

    try {
        const response = await fetch(`https://api.thingiverse.com/things/${thing}/files`, 
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
