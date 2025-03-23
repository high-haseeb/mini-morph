"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Scene from "./Experience";

interface ThingiverseThing {
    id: number;
    name: string;
    preview_image: string;
}

export const SearchBar = () => {
    const [activeThingID, setActiveThingID] = useState<number | null>();
    const [activeThingFileIndex, setActiveThingFileIndex] = useState<number>(0);
    const [activeThing, setActiveThing] = useState<ThingiverseThing | null>();
    const [activeThingFiles, setActiveThingFiles] = useState<any>();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [things, setThings] = useState<ThingiverseThing[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = "19adfc934c6d3f95ef2307781360e60b";
    const getThingFiles = async () => {
        const response = await fetch(`https://api.thingiverse.com/things/${activeThingID}/files`, 
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const body = await response.json();
        console.log(body);
        setActiveThingFiles(body);
    }

    useEffect(() => {
        if (activeThingID) getThingFiles();
    }, [activeThingID]);

    const search = async (newPage = 1) => {
        if (searchTerm === "") return;
        setLoading(true);

        try {
            const response = await fetch(
                `https://api.thingiverse.com/search/${encodeURIComponent(searchTerm)}/?type=things&page=${newPage}&per_page=4`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const body = await response.json();
            console.log(body);
            setThings(body.hits);
            setTotalPages(Math.ceil(body.total / 4));
            setPage(newPage);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div 
                className={`bg-background border-foreground/10 fixed bottom-0 left-1/2 z-50 h-[80vh] w-[80%] -translate-x-1/2 ${activeThingID ? "translate-y-0" : "translate-y-full"} rounded-xl border transition-transform flex items-center justify-between p-10 gap-10`}>
                <button onClick={() => {
                    setActiveThingID(null);
                    setActiveThingFileIndex(0);
                }} className="absolute right-4 top-4">
                    <Image src={"close.svg"} width={24} height={24} alt="close" />
                </button>
                <div className="w-1/2 rounded-md h-full flex flex-col gap-2 overflow-x-hidden">
                    <div className="w-full h-[80%]">{activeThingFiles && <Scene url={activeThingFiles[activeThingFileIndex].direct_url ?? null} /> }</div>
                    <div className="flex gap-2">
                        {
                            activeThingFiles && activeThingFiles.map((file: any, i: number) => <img onClick={() => setActiveThingFileIndex(i)} src={file.thumbnail} width={200} height={200} alt={file.name} key={`${file.name}-${i}`} className="w-20 h-auto object-contain rounded-sm hover:scale-110" />)
                        }
                    </div>
                </div>
                <div className="flex flex-col w-full items-start h-full gap-2">
                    <div className="font-semibold text-3xl capitalize">{activeThing?.name}</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-sky-500 rounded-md font-semibold">Buy now</button>
                        <button className="px-3 py-1 border-gray-500 border-2 rounded-md font-semibold">Add to cart</button>
                    </div>
                </div>
            </div>
            <div className="border-foreground/10 flex h-full w-full flex-col items-center justify-center border-t">
                <div className="border-x-foreground/10 flex w-[80%] flex-grow flex-col items-center justify-center border-x px-10 pb-4 pt-10">
                    <div className="w-xl flex max-w-2xl flex-col items-center gap-4">
                        <div className="flex w-full gap-2">
                            <input
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Search for a model..."
                                className="flex-1 rounded-lg p-3 outline-none ring ring-gray-200 focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={() => search(1)}
                                className="bg-foreground text-background rounded-2xl p-3 transition-colors hover:bg-gray-800"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Image src="/loader.svg" width={24} height={24} alt="loading" className="animate-spin" />
                                ) : (
                                        <Image src="/search.svg" width={24} height={24} alt="search" />
                                    )}
                            </button>
                        </div>
                    </div>


                    {loading ? (
                        <div className="mb-auto mt-8 grid h-max w-full grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="border-foreground/30 hover:bg-foreground/10 flex animate-pulse flex-col rounded-xl border p-4 shadow-md">
                                    <div className="h-80 w-full rounded-md bg-gray-300" />
                                    <div className="mt-2 h-6 w-3/4 rounded-md bg-gray-300" />
                                </div>
                            ))}
                        </div>
                    ) : things.length > 0 ? (
                            <div className="mb-auto mt-8 grid h-max w-full grid-cols-4 gap-4">
                                {things.map((thing) => (
                                    <div 
                                        key={thing.id}
                                        className="border-foreground/30 hover:bg-foreground/10 flex flex-col rounded-xl border p-4 shadow-md"
                                        onClick={() => {
                                            setActiveThingID(thing.id) 
                                            setActiveThing(thing);
                                        }}
                                    >
                                        <img
                                            src={thing.preview_image}
                                            alt={thing.name}
                                            className="h-80 w-full rounded-md object-cover"
                                        />
                                        <div className="mt-2 text-left text-xl font-medium">{thing.name}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                                <div className="flex h-full w-full items-center justify-center">search for anything...</div>
                            )}

                    {things.length > 0 && (
                        <button
                            className="text-background bg-foreground rounded-md px-3 py-1 flex gap-2 items-center justify-center cursor-pointer" 
                            onClick={() => search(page + 1 > totalPages ? 1 : page + 1)}>
                            <Image src={"wand.svg"} width={24} height={24} alt="reimagine" />
                            <div className="text-lg">reimagine</div>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
