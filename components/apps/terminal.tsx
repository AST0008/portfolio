"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTypewriter } from "react-simple-typewriter"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface TerminalProps {
  onExecuteCommand: (command: string) => void
}

export default function Terminal({ onExecuteCommand }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [fontSize, setFontSize] = useState(14)
  const [opacity, setOpacity] = useState(0.8)
  const [showSettings, setShowSettings] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const [introText] = useTypewriter({
    words: ["Welcome to DevOS Terminal v1.0.0", 'Type "help" to see available commands'],
    loop: 1,
    typeSpeed: 50,
    deleteSpeed: 10,
  })

  useEffect(() => {
    // Auto-focus the input when terminal is opened
    inputRef.current?.focus()

    // Add initial welcome message
    setHistory(["DevOS Terminal v1.0.0", 'Type "help" to see available commands', ""])
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add command to history
    setHistory((prev) => [...prev, `> ${input}`])
    setCommandHistory((prev) => [input, ...prev])

    // Process command
    processCommand(input)

    // Reset input and history index
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion
      if (input.startsWith("ls")) {
        setInput("ls projects")
      } else if (input.startsWith("open")) {
        setInput("open resume")
      } else if (input.startsWith("help")) {
        setInput("help")
      }
    }
  }

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()

    switch (command) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  clear - Clear the terminal",
          "  ls - List available sections",
          "  ls projects - List projects",
          "  open resume - Open resume",
          "  contact - Open contact form",
          "  open ailab - Open AI Lab",
          "  open blog - Open blog",
          "  whoami - Display information about me",
          "  date - Display current date and time",
          "  settings - Open terminal settings",
          "",
        ])
        break

      case "clear":
        setHistory([])
        break

      case "ls":
        setHistory((prev) => [
          ...prev,
          "Available sections:",
          "  projects - View my projects",
          "  resume - View my resume",
          "  contact - Contact information",
          "  ailab - AI experiments",
          "  blog - Read my blog posts",
          "",
        ])
        break

      case "ls projects":
        setHistory((prev) => [
          ...prev,
          "Projects:",
          "  1. Portfolio OS - This website",
          "  2. AI Image Generator - Create images with AI",
          "  3. Smart Home Dashboard - IoT control panel",
          "  4. Crypto Tracker - Real-time cryptocurrency data",
          "",
        ])
        onExecuteCommand(command)
        break

      case "open resume":
        setHistory((prev) => [...prev, "Opening resume...", ""])
        onExecuteCommand(command)
        break

      case "contact":
        setHistory((prev) => [...prev, "Opening contact form...", ""])
        onExecuteCommand(command)
        break

      case "open ailab":
        setHistory((prev) => [...prev, "Opening AI Lab...", ""])
        onExecuteCommand(command)
        break

      case "open blog":
        setHistory((prev) => [...prev, "Opening blog...", ""])
        onExecuteCommand(command)
        break

      case "whoami":
        setHistory((prev) => [
          ...prev,
          "Full-stack developer with expertise in:",
          "  - React, Next.js, TypeScript",
          "  - Node.js, Express, MongoDB",
          "  - AI/ML integration",
          "  - UI/UX design",
          "",
        ])
        break

      case "date":
        setHistory((prev) => [...prev, new Date().toLocaleString(), ""])
        break

      case "settings":
        setShowSettings(true)
        break

      default:
        setHistory((prev) => [...prev, `Command not found: ${command}`, 'Type "help" to see available commands', ""])
    }
  }

  const terminalStyle = {
    fontSize: `${fontSize}px`,
    backgroundColor: `rgba(15, 23, 42, ${opacity})`,
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm rounded-md transition-all duration-300"
        style={terminalStyle}
      >
        {history.map((line, index) => (
          <div key={index} className="terminal-text whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex items-center border-t border-border p-2">
        <span className="terminal-text mr-2">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none terminal-text"
          style={{ fontSize: `${fontSize}px` }}
          autoFocus
        />
      </form>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Terminal Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Font Size: {fontSize}px</Label>
                <span className="text-muted-foreground">{fontSize}px</span>
              </div>
              <Slider value={[fontSize]} min={10} max={24} step={1} onValueChange={(value) => setFontSize(value[0])} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Background Opacity: {Math.round(opacity * 100)}%</Label>
                <span className="text-muted-foreground">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                value={[opacity * 100]}
                min={20}
                max={100}
                step={5}
                onValueChange={(value) => setOpacity(value[0] / 100)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowSettings(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
