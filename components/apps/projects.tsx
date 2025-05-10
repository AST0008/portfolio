"use client"

import { useState } from "react"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  title: string
  description: string
  image: string
  techStack: string[]
  demoUrl: string
  githubUrl: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio OS",
    description: "A desktop operating system themed portfolio website built with Next.js and Tailwind CSS.",
    image: "/placeholder.svg?height=200&width=300",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "AI Image Generator",
    description: "Web application that generates images using AI models with customizable parameters.",
    image: "/placeholder.svg?height=200&width=300",
    techStack: ["React", "Node.js", "OpenAI API", "MongoDB"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Smart Home Dashboard",
    description: "IoT control panel for managing smart home devices with real-time updates.",
    image: "/placeholder.svg?height=200&width=300",
    techStack: ["React", "Express", "Socket.io", "MQTT"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Crypto Tracker",
    description: "Real-time cryptocurrency tracking dashboard with price alerts and portfolio management.",
    image: "/placeholder.svg?height=200&width=300",
    techStack: ["Vue.js", "Firebase", "Chart.js", "CoinGecko API"],
    demoUrl: "#",
    githubUrl: "#",
  },
]

export default function Projects() {
  const [filter, setFilter] = useState<string | null>(null)

  const filteredProjects = filter ? projects.filter((project) => project.techStack.includes(filter)) : projects

  const allTechStacks = Array.from(new Set(projects.flatMap((project) => project.techStack))).sort()

  return (
    <div className="h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 font-mono text-primary">Projects</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {filter && (
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/20" onClick={() => setFilter(null)}>
              Clear filter
            </Badge>
          )}

          {allTechStacks.map((tech) => (
            <Badge
              key={tech}
              variant={filter === tech ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => setFilter(tech === filter ? null : tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
            <div className="aspect-video overflow-hidden">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            <CardHeader>
              <CardTitle className="font-mono text-primary">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </Button>
              <Button size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                <span>Demo</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
