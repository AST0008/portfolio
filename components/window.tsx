"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Minimize2, X, Maximize2 } from "lucide-react"
import { motion } from "framer-motion"

interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
  isActive: boolean
}

export default function Window({
  id,
  title,
  children,
  zIndex,
  position,
  size,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
  onSizeChange,
  isActive,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position: { x: 0, y: 0 }, size: { width: 0, height: 0 } })
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onPositionChange({ x: newX, y: newY })
      }

      if (isResizing) {
        let newWidth = size.width
        let newHeight = size.height
        let newX = position.x
        let newY = position.y

        // Handle different resize directions
        switch (resizeDirection) {
          case "bottom-right":
            newWidth = resizeStart.width + (e.clientX - resizeStart.x)
            newHeight = resizeStart.height + (e.clientY - resizeStart.y)
            break
          case "bottom-left":
            newWidth = resizeStart.width - (e.clientX - resizeStart.x)
            newHeight = resizeStart.height + (e.clientY - resizeStart.y)
            newX = resizeStart.x + (e.clientX - resizeStart.x)
            break
          case "top-right":
            newWidth = resizeStart.width + (e.clientX - resizeStart.x)
            newHeight = resizeStart.height - (e.clientY - resizeStart.y)
            newY = resizeStart.y + (e.clientY - resizeStart.y)
            break
          case "top-left":
            newWidth = resizeStart.width - (e.clientX - resizeStart.x)
            newHeight = resizeStart.height - (e.clientY - resizeStart.y)
            newX = resizeStart.x + (e.clientX - resizeStart.x)
            newY = resizeStart.y + (e.clientY - resizeStart.y)
            break
          case "right":
            newWidth = resizeStart.width + (e.clientX - resizeStart.x)
            break
          case "left":
            newWidth = resizeStart.width - (e.clientX - resizeStart.x)
            newX = resizeStart.x + (e.clientX - resizeStart.x)
            break
          case "bottom":
            newHeight = resizeStart.height + (e.clientY - resizeStart.y)
            break
          case "top":
            newHeight = resizeStart.height - (e.clientY - resizeStart.y)
            newY = resizeStart.y + (e.clientY - resizeStart.y)
            break
        }

        // Apply minimum size constraints
        newWidth = Math.max(300, newWidth)
        newHeight = Math.max(200, newHeight)

        onSizeChange({ width: newWidth, height: newHeight })
        if (newX !== position.x || newY !== position.y) {
          onPositionChange({ x: newX, y: newY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onPositionChange, onSizeChange, position, size, resizeDirection])

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus()

    if (e.target === e.currentTarget) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    onFocus()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous size and position
      onSizeChange(preMaximizeState.size)
      onPositionChange(preMaximizeState.position)
    } else {
      // Save current size and position
      setPreMaximizeState({
        position: { ...position },
        size: { ...size },
      })

      // Maximize to full screen (with small margins)
      const maxWidth = window.innerWidth - 40
      const maxHeight = window.innerHeight - 40
      onSizeChange({ width: maxWidth, height: maxHeight })
      onPositionChange({ x: 20, y: 20 })
    }
    setIsMaximized(!isMaximized)
  }

  return (
    <motion.div
      ref={windowRef}
      className={`window absolute ${isActive ? "ring-1 ring-primary" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      }}
      onClick={onFocus}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="window-header" onMouseDown={handleMouseDown} onDoubleClick={toggleMaximize}>
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-destructive cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            whileHover={{ scale: 1.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
            whileHover={{ scale: 1.2 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximize()
            }}
            whileHover={{ scale: 1.2 }}
          />
        </div>
        <div className="font-mono text-sm">{title}</div>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-muted-foreground hover:text-foreground"
            onClick={onMinimize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minimize2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleMaximize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="window-content" style={{ height: `calc(100% - 40px)` }}>
        {children}
      </div>

      {/* Resize handles */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
      />
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
      />

      <div
        className="absolute right-0 top-[20px] w-4 h-[calc(100%-40px)] cursor-e-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "right")}
      />
      <div
        className="absolute left-0 top-[20px] w-4 h-[calc(100%-40px)] cursor-w-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "left")}
      />
      <div
        className="absolute bottom-0 left-[20px] w-[calc(100%-40px)] h-4 cursor-s-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
      />
      <div
        className="absolute top-[40px] left-[20px] w-[calc(100%-40px)] h-4 cursor-n-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "top")}
      />
    </motion.div>
  )
}
