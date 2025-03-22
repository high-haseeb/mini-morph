"use client";
import Scene from "@/components/Experience";
import Image from "next/image";
import { useState } from "react";
import { fileURLToPath } from "url";

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

    const search = async () => {
        if (searchTerm == "") return;
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

                    console.log(filesBody);
                    const model_url = filesBody[0].direct_url

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
        <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center overflow-x-hidden p-10">
            <div className="mb-5 text-5xl font-semibold">Mini Morph</div>
            <div className="w-xl mb-5 flex max-w-2xl items-center justify-center gap-2 mb-8">
                <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    className="rounded-lg p-2 outline-2 outline-gray-200 focus:outline-blue-200 w-md"
                    required
                />
                <button 
                    onClick={search} 
                    className="bg-foreground text-background rounded-full p-2 text-lg hover:shadow-md hover:bg-gray-800 transition-colors"
                    disabled={loading}
                >
                    {
                        loading ?  
                            <Image src={"/loader.svg"} width={24} height={24} alt="search" className="animate-spin" /> 
                            :
                            <Image src={"/search.svg"} width={24} height={24} alt="search" /> 
                    }
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full h-full">
                {things.map((thing) => (
                    <div key={thing.id} className="flex rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md">
                        <div className="flex flex-col gap-2">
                            <img
                                src={thing.preview_image}
                                alt={thing.name}
                                className="h-40 w-full rounded-md object-cover"
                            />
                            <div className="mt-2 text-center font-medium">{thing.name}</div>
                        </div>
                        <Scene url={thing.model_url} />
                    </div>
                ))}
            </div>
        </div>
    );
}

