"use client";

import type React from "react";
import type { AppType } from "@/components/desktop";
import {
  Terminal,
  FolderKanban,
  User,
  Mail,
  Brain,
  BookText,
} from "lucide-react";
import { motion } from "framer-motion";

interface DockProps {
  activeApp?: AppType | null;
  onAppClick: (app: AppType) => void;
}

export default function Dock({ activeApp, onAppClick }: DockProps) {
  const apps: { id: AppType; icon: React.ReactNode; label: string }[] = [
    {
      id: "terminal",
      icon: <Terminal className="w-6 h-6" />,
      label: "Terminal",
    },
    {
      id: "projects",
      icon: <FolderKanban className="w-6 h-6" />,
      label: "Projects",
    },
    { id: "about", icon: <User className="w-6 h-6" />, label: "About Me" },
    { id: "contact", icon: <Mail className="w-6 h-6" />, label: "Contact" },
    { id: "ailab", icon: <Brain className="w-6 h-6" />, label: "AI Lab" },
    { id: "blog", icon: <BookText className="w-6 h-6" />, label: "Blog" },
  ];

  return (
    <motion.div
      className="absolute bottom-1 left-1/2 -translate-x-1/2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
    >
      <div className="flex items-center justify-center gap-2 bg-black/30 backdrop-blur-lg p-3 rounded-full border border-white/10 min-w-fit">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
              activeApp === app.id
                ? "bg-primary text-primary-foreground"
                : "bg-card/80 text-foreground hover:bg-card"
            } cursor-pointer border border-white/10`}
            onClick={() => onAppClick(app.id)}
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {app.icon}

            {/* Tooltip using only motion (no group-hover) */}
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {app.label}
            </motion.div>

            {/* Active app indicator dot */}
            {activeApp === app.id && (
              <div className="absolute -bottom-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
