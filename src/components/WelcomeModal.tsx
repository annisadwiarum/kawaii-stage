"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type WelcomeModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string | null;
  targetTitle: string;
  targetDescription: string;
  confirmLabel?: string;
};

export default function WelcomeModal({
  open,
  onClose,
  onConfirm,
  userName,
  targetTitle,
  targetDescription,
  confirmLabel = "Let's go!",
}: WelcomeModalProps) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const greetingName = userName?.split(" ")[0] || "Explorer";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="welcome-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900/80 p-8 text-white shadow-2xl shadow-pink-500/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">
              Welcome back
            </div>
            <h3 className="mt-3 text-2xl font-semibold">
              Konbanwa, <span className="text-pink-300">{greetingName}</span>!
            </h3>
            <p className="mt-4 text-sm text-gray-300">{targetTitle}</p>
            <p className="mt-2 text-sm text-gray-400">{targetDescription}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                className="sm:w-auto"
                onClick={onClose}
              >
                Maybe later
              </Button>
              <Button
                className="bg-pink-500 text-white hover:bg-pink-400 sm:w-auto"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
