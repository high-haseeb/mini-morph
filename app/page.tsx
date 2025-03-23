import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { Toaster } from "@/components/Toaster";

export default function Homepage() {
    return (
        <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center font-sans">
            <Navbar />
            <div className="border-x-foreground/10 flex w-full flex-col border-x p-10 md:w-full lg:w-[80%]">
                <h1 className="text-4xl font-bold leading-snug tracking-tight">Mini Morph</h1>
                <p className="text-foreground w-3xl text-lg leading-tight">
                    Buy 3D models, and we’ll print and ship them to you. High-quality, hassle-free, and ready to bring your ideas to life!
                </p>
            </div>
            <SearchBar />
            <Toaster />
            <Footer />
        </div>
    );
}
