"use client";
import Scene from "@/components/Experience";
import Image from "next/image";
import { useState } from "react";

interface ThingiverseThing {
    id: number;
    name: string;
    preview_image: string;
    public_url: string;
    model_url: string;
}

export default function Homepage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [things, setThings] = useState<ThingiverseThing[]>([]);
    const [image, setImage] = useState<File | null>(null);

    const search = async () => {
        if (searchTerm === "") return;
        setLoading(true);
        const token = "19adfc934c6d3f95ef2307781360e60b";

        try {
            const response = await fetch(
                `https://api.thingiverse.com/search/${encodeURIComponent(searchTerm)}/?type=things&page=1&per_page=4`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const body = await response.json();

            const thingsWithSTL = await Promise.all(
                (body.hits || []).map(async (thing: any) => {
                    const filesResponse = await fetch(
                        `https://api.thingiverse.com/things/${thing.id}/files`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const filesBody = await filesResponse.json();
                    const model_url = filesBody[0]?.direct_url || "";

                    return {
                        id: thing.id,
                        name: thing.name,
                        preview_image: thing.preview_image,
                        public_url: thing.public_url,
                        model_url: model_url,
                    };
                })
            );
            setThings(thingsWithSTL);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center p-10">
            <div className="mb-5 text-5xl font-semibold">Mini Morph</div>
            <div className="w-xl max-w-2xl flex flex-col gap-4 items-center">
                <div className="flex w-full gap-2">
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search for a model..."
                        className="flex-1 rounded-lg p-3 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={search}
                        className="bg-foreground text-background rounded-2xl p-3 hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <Image src="/loader.svg" width={24} height={24} alt="loading" className="animate-spin" />
                        ) : (
                            <Image src="/search.svg" width={24} height={24} alt="search" />
                        )}
                    </button>
                </div>
                <div className="text-gray-400">or</div>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                    </label>
                    {image && <span className="text-gray-600">{image.name}</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full h-full mt-8">
                {things.map((thing) => (
                    <div key={thing.id} className="flex rounded-lg border border-gray-200 p-4 shadow-md">
                        <div className="flex flex-col gap-2">
                            <img
                                src={thing.preview_image}
                                alt={thing.name}
                                className="h-40 w-full rounded-md object-cover"
                            />
                            <div className="mt-2 text-center font-medium text-lg">{thing.name}</div>
                        </div>
                        <Scene url={thing.model_url} />
                    </div>
                ))}
            </div>
        </div>
    );
}
