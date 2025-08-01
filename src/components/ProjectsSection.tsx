"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Sistem Booking Hotel",
    description: "Aplikasi booking hotel modern dengan Next.js dan Tailwind. Responsif, cepat, dan user-friendly.",
    tech: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    title: "Dashboard Admin Laravel",
    description: "Dashboard interaktif dengan Laravel dan Vue. Menampilkan statistik, filter data, dan sistem login.",
    tech: ["Laravel", "Vue", "MySQL"],
  },
  {
    title: "Portfolio 3D Interaktif",
    description: "Eksperimen portfolio 3D ringan dengan React Three Fiber dan animasi interaktif.",
    tech: ["Three.js", "React", "Framer Motion"],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-6 md:px-16 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-indigo-400 text-center mb-12"
        >
          Proyek Terpilih
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-zinc-800 rounded-xl p-6 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
