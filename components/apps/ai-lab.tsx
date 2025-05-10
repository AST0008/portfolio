"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sparkles, ImageIcon, MessageSquare, Code } from "lucide-react"

export default function AILab() {
  const [imagePrompt, setImagePrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I'm your AI assistant. How can I help you today?" },
  ])

  const handleImageGenerate = () => {
    if (!imagePrompt.trim()) return

    setIsGenerating(true)

    // Simulate image generation
    setTimeout(() => {
      setGeneratedImage("/placeholder.svg?height=512&width=512")
      setIsGenerating(false)
    }, 2000)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!chatInput.trim()) return

    // Add user message
    setChatHistory((prev) => [...prev, { role: "user", content: chatInput }])

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: `I received your message: "${chatInput}". This is a simulated response in the AI Lab demo.`,
        },
      ])
    }, 1000)

    setChatInput("")
  }

  return (
    <div className="h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 font-mono text-primary">AI Lab</h2>

      <Tabs defaultValue="image-gen" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="image-gen">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image Generator
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="w-4 h-4 mr-2" />
            Code Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image-gen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Image Generator</CardTitle>
              <CardDescription>Generate images using AI by providing a text prompt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <div className="flex gap-2">
                  <Input
                    id="prompt"
                    placeholder="A futuristic city with neon lights..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                  <Button onClick={handleImageGenerate} disabled={isGenerating || !imagePrompt.trim()}>
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Settings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="creativity">Creativity</Label>
                      <span className="text-xs text-muted-foreground">70%</span>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="detail">Detail Level</Label>
                      <span className="text-xs text-muted-foreground">80%</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start">
              {generatedImage && (
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Generated Image:</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <img src={generatedImage || "/placeholder.svg"} alt="AI Generated" className="w-full h-auto" />
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Chat</CardTitle>
              <CardDescription>Have a conversation with an AI assistant.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button type="submit" disabled={!chatInput.trim()}>
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Assistant</CardTitle>
              <CardDescription>Get help with coding problems and generate code snippets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Code Assistant Demo</h3>
                  <p className="text-muted-foreground mb-4">
                    This is a placeholder for the Code Assistant feature. In a real implementation, this would connect
                    to an AI model that can help with coding tasks.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
