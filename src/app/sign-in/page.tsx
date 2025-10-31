"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const FeatureBullet = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-sm font-semibold text-white">{title}</p>
    <p className="mt-1 text-xs text-indigo-100/80">{description}</p>
  </div>
);

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRedirect = searchParams.get("redirect");
  const redirectTarget = rawRedirect && rawRedirect.startsWith("/") ? rawRedirect : "/";

  if (status === "loading") {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.18),transparent_55%)]" />
        <div className="relative text-sm text-indigo-100/80">
          Menyiapkan panggung buat kamu...
        </div>
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";
  const greetingName = session?.user?.name?.split(" ")[0] ?? "Explorer";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/30 blur-3xl" />
        <div className="absolute left-[15%] top-[40%] h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[10%] bottom-[20%] h-56 w-56 rounded-full bg-sky-500/20 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.32em] text-indigo-100/80">
              Kawaii Stage Access
            </span>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {isAuthenticated
                ? `Halo ${greetingName}, siap nerusin petualanganmu?`
                : "Yuk, siapin avatar kamu sebelum masuk ke Kawaii Stage"}
            </h1>
            <p className="max-w-xl text-sm text-indigo-100/80 md:text-base">
              {isAuthenticated
                ? "Seluruh progress kamu udah sinkron. Pilih mau langsung belajar, main, atau eksplor komunitas."
                : "Login dulu pake Google biar progress lesson, badge, dan Sakura Coins kamu tersimpan rapi di server kami."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureBullet
                title="Single Sign-On"
                description="Langsung pake akun Google kamu, nggak perlu bikin password baru."
              />
              <FeatureBullet
                title="Progress Sync"
                description="Semua streak, badge, dan playlist lesson otomatis ke-save."
              />
              <FeatureBullet
                title="Arcade Access"
                description="Buka leaderboard, mini game, dan event komunitas eksklusif."
              />
              <FeatureBullet
                title="Community Drops"
                description="Dapetin notifikasi event live bareng senpai tiap minggu."
              />
            </div>
          </div>

          <div className="h-full">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-pink-500/20 backdrop-blur h-full">
              {isAuthenticated ? (
                <div className="flex flex-col items-center gap-5 text-center">
                  <Avatar className="size-20">
                    {session?.user?.image ? (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name ?? "Avatar"}
                      />
                    ) : (
                      <AvatarFallback className="text-3xl font-semibold">
                        {session?.user?.name?.charAt(0) ?? "K"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                      Welcome back
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {session?.user?.name}
                    </h2>
                    <p className="mt-1 text-xs text-indigo-100/80">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="grid w-full gap-3">
                    <Button
                      className="w-full bg-pink-500 text-white hover:bg-pink-400"
                      onClick={() => router.push(redirectTarget)}
                    >
                      Masuk ke Kawaii Stage
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full border border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between items-center text-center gap-6 h-full">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                      Step into the stage
                      </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      Sign In
                    </h2>
                    <p className="mt-2 text-xs text-indigo-100/80">
                      Dengan login kamu setuju sama vibe positif dan anti drama
                      kami ya~
                    </p>
                    </div>
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                      ✨
                    </div>
                  <div className="flex flex-col gap-6">
                    <Button
                      onClick={() => signIn("google", { callbackUrl: redirectTarget })}
                      className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/90 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.02] hover:bg-white"
                    >
                      <FcGoogle className="text-xl" />
                      Sign in with Google
                    </Button>

                    <p className="text-[10px] text-indigo-100/70">
                      Kami cuma lihat nama dan email kamu buat nyimpen progress.
                      Kamu bisa cabut kapan aja.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
