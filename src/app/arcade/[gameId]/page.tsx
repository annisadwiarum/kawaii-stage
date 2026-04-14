import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import KanaSpeedTap from "@/components/arcade/KanaSpeedTap";

export default function GamePage({ params }: { params: { gameId: string } }) {
  if (params.gameId === "kana-speed-tap") {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-6">
          <Link href="/arcade" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Arcade
          </Link>
        </div>
        
        <div className="w-full">
          <KanaSpeedTap />
        </div>
      </div>
    );
  }

  // Not found fallback for unknown games
  notFound();
}
