import { Cherry } from "lucide-react";

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "Arcade", href: "#games" },
  { label: "Writing Lab", href: "/write" },
  { label: "Contact", href: "#contact" },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-black/70 px-6 py-8 text-sm text-gray-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-left">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/15 text-pink-300">
            <Cherry className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/80">
              Made with senpai energy
            </p>
            <p className="text-base font-medium text-white">
              © 2025 Kawaii Stage · Crafted by Nissa-Chan
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide text-indigo-200/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-pink-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
