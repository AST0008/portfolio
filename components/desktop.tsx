"use client";

import { useState, useEffect } from "react";
import Dock from "@/components/dock";
import Window from "@/components/window";
import Terminal from "@/components/apps/terminal";
import Projects from "@/components/apps/projects";
import About from "@/components/apps/about";
import Contact from "@/components/apps/contact";
import AILab from "@/components/apps/ai-lab";
import Blog from "@/components/apps/blog";
import { AnimatedBackground } from "@/components/animated-background";
import { useMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

export type AppType =
  | "terminal"
  | "projects"
  | "about"
  | "contact"
  | "ailab"
  | "blog";

export interface WindowState {
  id: string;
  app: AppType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export default function Desktop() {
  const isMobile = useMobile();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [activeApp, setActiveApp] = useState<AppType | null>(null);

  const initialWindowSizes = {
    terminal: { width: 600, height: 400 },
    projects: { width: 800, height: 600 },
    about: { width: 700, height: 500 },
    contact: { width: 500, height: 400 },
    ailab: { width: 800, height: 600 },
    blog: { width: 900, height: 650 },
  };

  const appTitles = {
    terminal: "Terminal",
    projects: "Projects",
    about: "About Me",
    contact: "Contact",
    ailab: "AI Lab",
    blog: "Blog",
  };

  useEffect(() => {
    // Initialize windows with default positions
    const initialWindows: WindowState[] = [
      "terminal",
      "projects",
      "about",
      "contact",
      "ailab",
      "blog",
    ].map((app, index) => ({
      id: `window-${app}`,
      app: app as AppType,
      title: appTitles[app as AppType],
      isOpen: false,
      isMinimized: false,
      zIndex: 100 + index,
      position: {
        x: 100 + index * 30,
        y: 100 + index * 30,
      },
      size: initialWindowSizes[app as AppType],
    }));

    setWindows(initialWindows);
    setHighestZIndex(100 + initialWindows.length);
  }, []);

  const openApp = (app: AppType) => {
    setWindows((prev) => {
      const newWindows = [...prev];
      const windowIndex = newWindows.findIndex((w) => w.app === app);

      if (windowIndex !== -1) {
        // If window exists but is minimized, restore it
        if (newWindows[windowIndex].isMinimized) {
          newWindows[windowIndex].isMinimized = false;
        }

        // If window is not open, open it
        if (!newWindows[windowIndex].isOpen) {
          newWindows[windowIndex].isOpen = true;
        }

        // Bring to front
        const newZIndex = highestZIndex + 1;
        newWindows[windowIndex].zIndex = newZIndex;
        setHighestZIndex(newZIndex);
        setActiveApp(app);
      }

      return newWindows;
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => {
      const newWindows = prev.map((window) =>
        window.id === id ? { ...window, isOpen: false } : window
      );
      const openWindows = newWindows.filter((w) => w.isOpen && !w.isMinimized);
      if (openWindows.length > 0) {
        setActiveApp(openWindows[openWindows.length - 1].app);
      } else {
        setActiveApp(null);
      }
      return newWindows;
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => {
      const newWindows = prev.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window
      );
      const openWindows = newWindows.filter((w) => w.isOpen && !w.isMinimized);
      if (openWindows.length > 0) {
        setActiveApp(openWindows[openWindows.length - 1].app);
      } else {
        setActiveApp(null);
      }
      return newWindows;
    });
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const newWindows = [...prev];
      const windowIndex = newWindows.findIndex((w) => w.id === id);

      if (windowIndex !== -1) {
        const newZIndex = highestZIndex + 1;
        newWindows[windowIndex].zIndex = newZIndex;
        setHighestZIndex(newZIndex);
        setActiveApp(newWindows[windowIndex].app);
      }

      return newWindows;
    });
  };

  const updateWindowPosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, position } : window
      )
    );
  };

  const updateWindowSize = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, size } : window))
    );
  };

  const executeTerminalCommand = (command: string) => {
    if (command === "ls projects") {
      openApp("projects");
    } else if (command === "open resume") {
      openApp("about");
    } else if (command === "contact") {
      openApp("contact");
    } else if (command === "open ailab") {
      openApp("ailab");
    } else if (command === "open blog") {
      openApp("blog");
    }
  };

  // For mobile, we'll use a different layout
  if (isMobile) {
    return (
      <div className="min-h-screen animated-gradient">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-6 font-mono text-primary">
            Developer OS
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {["terminal", "projects", "about", "contact", "ailab", "blog"].map(
              (app) => (
                <motion.button
                  key={app}
                  className="aspect-square bg-card/80 backdrop-blur-md rounded-lg flex flex-col items-center justify-center p-4 border border-border hover:border-primary transition-all"
                  onClick={() => openApp(app as AppType)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">
                    {app === "terminal" && "💻"}
                    {app === "projects" && "🚀"}
                    {app === "about" && "👤"}
                    {app === "contact" && "📧"}
                    {app === "ailab" && "🤖"}
                    {app === "blog" && "📝"}
                  </div>
                  <span className="text-sm font-mono">
                    {appTitles[app as AppType]}
                  </span>
                </motion.button>
              )
            )}
          </div>
        </div>

        <AnimatePresence>
          {windows
            .filter((w) => w.isOpen && !w.isMinimized)
            .map((window) => (
              <motion.div
                key={window.id}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md p-4 overflow-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold font-mono">
                    {window.title}
                  </h2>
                  <motion.button
                    onClick={() => closeWindow(window.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="h-[calc(100vh-100px)] overflow-auto">
                  {window.app === "terminal" && (
                    <Terminal onExecuteCommand={executeTerminalCommand} />
                  )}
                  {window.app === "projects" && <Projects />}
                  {window.app === "about" && <About />}
                  {window.app === "contact" && <Contact />}
                  {window.app === "ailab" && <AILab />}
                  {window.app === "blog" && <Blog />}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      <AnimatedBackground />

      <AnimatePresence>
        {windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .map((window) => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              zIndex={window.zIndex}
              position={window.position}
              size={window.size}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onPositionChange={(position) =>
                updateWindowPosition(window.id, position)
              }
              onSizeChange={(size) => updateWindowSize(window.id, size)}
              isActive={activeApp === window.app}
            >
              {window.app === "terminal" && (
                <Terminal onExecuteCommand={executeTerminalCommand} />
              )}
              {window.app === "projects" && <Projects />}
              {window.app === "about" && <About />}
              {window.app === "contact" && <Contact />}
              {window.app === "ailab" && <AILab />}
              {window.app === "blog" && <Blog />}
            </Window>
          ))}
      </AnimatePresence>

      <Dock activeApp={activeApp} onAppClick={openApp} />
    </div>
  );
}
