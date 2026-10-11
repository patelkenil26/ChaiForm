"use client";

import {
  IconBrandNextjs,
  IconDatabase,
  IconBolt,
  IconCpu,
  IconCode,
  IconBrandTailwind,
  IconBrandDocker,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

export function TechStackSection() {
  const technologies = [
    { name: "Next.js 16", desc: "Turbopack & App Router", icon: IconBrandNextjs },
    { name: "tRPC v11", desc: "End-to-End Type Safety", icon: IconBolt },
    { name: "Drizzle ORM", desc: "Lightweight Type-Safe SQL", icon: IconCode },
    { name: "PostgreSQL", desc: "Robust Relational Engine", icon: IconDatabase },
    { name: "Tailwind CSS v4", desc: "High-Performance Modern Styling", icon: IconBrandTailwind },
    { name: "Dockerized DB", desc: "Reliable Local & Cloud Containers", icon: IconBrandDocker },
  ];

  return (
    <section id="architecture" className="py-20 md:py-24 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary gap-1.5 mb-3">
            <IconCpu className="size-3.5" />
            Production-Ready Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built on a battle-tested monorepo stack.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Fast, scalable, and type-safe from database tables to client React components.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/70 bg-card/50 text-center hover:border-primary/40 hover:bg-card transition-all group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5 group-hover:scale-110 transition-transform">
                <tech.icon className="size-5" />
              </div>
              <div className="text-xs font-bold text-foreground">{tech.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
