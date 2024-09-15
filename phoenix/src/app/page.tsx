
import { Hero } from "@/components/Hero";
import { FloatingNavDemo } from "@/components/Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center">
      <FloatingNavDemo />
      <BackgroundBeams />
      <Hero />
    </div>
  );
}
