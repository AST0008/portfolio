"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TimelineItem {
  id: number
  year: string
  title: string
  company: string
  description: string
}

interface Skill {
  name: string
  level: number
  category: "frontend" | "backend" | "design" | "other"
  color: string
}

const timeline: TimelineItem[] = [
  {
    id: 1,
    year: "2022 - Present",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    description: "Leading the frontend team in developing modern web applications using Next.js and TypeScript.",
  },
  {
    id: 2,
    year: "2020 - 2022",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    description: "Developed and maintained full-stack applications using React, Node.js, and MongoDB.",
  },
  {
    id: 3,
    year: "2018 - 2020",
    title: "Web Developer",
    company: "Creative Web Agency",
    description: "Created responsive websites and web applications for various clients.",
  },
  {
    id: 4,
    year: "2016 - 2018",
    title: "Junior Developer",
    company: "Startup Ventures",
    description: "Started my career working on frontend development with HTML, CSS, and JavaScript.",
  },
]

const skills: Skill[] = [
  { name: "React", level: 90, category: "frontend", color: "bg-blue-500" },
  { name: "Next.js", level: 85, category: "frontend", color: "bg-black" },
  { name: "TypeScript", level: 80, category: "frontend", color: "bg-blue-600" },
  { name: "Tailwind CSS", level: 85, category: "frontend", color: "bg-cyan-500" },
  { name: "Node.js", level: 75, category: "backend", color: "bg-green-600" },
  { name: "Express", level: 70, category: "backend", color: "bg-gray-600" },
  { name: "MongoDB", level: 65, category: "backend", color: "bg-green-500" },
  { name: "PostgreSQL", level: 60, category: "backend", color: "bg-blue-400" },
  { name: "UI/UX Design", level: 75, category: "design", color: "bg-purple-500" },
  { name: "Figma", level: 70, category: "design", color: "bg-purple-600" },
  { name: "Git", level: 80, category: "other", color: "bg-orange-600" },
  { name: "Docker", level: 65, category: "other", color: "bg-blue-700" },
]

export default function About() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-6">
          <h2 className="text-2xl font-bold mb-4 font-mono text-primary">Work Experience</h2>

          <div className="relative border-l-2 border-muted pl-6 ml-6 space-y-10">
            {timeline.map((item) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-[30px] w-5 h-5 rounded-full bg-primary"></div>
                <div className="mb-1 text-sm text-muted-foreground">{item.year}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <div className="text-sm text-primary mb-2">{item.company}</div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <h2 className="text-2xl font-bold mb-4 font-mono text-primary">Skills</h2>

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant={activeCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Badge>
            <Badge
              variant={activeCategory === "frontend" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("frontend")}
            >
              Frontend
            </Badge>
            <Badge
              variant={activeCategory === "backend" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("backend")}
            >
              Backend
            </Badge>
            <Badge
              variant={activeCategory === "design" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("design")}
            >
              Design
            </Badge>
            <Badge
              variant={activeCategory === "other" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory("other")}
            >
              Other
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${skill.color}`} style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education">
          <h2 className="text-2xl font-bold mb-4 font-mono text-primary">Education</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Master of Computer Science</CardTitle>
              <CardDescription>2014 - 2016</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-primary mb-2">Tech University</p>
              <p className="text-muted-foreground">
                Specialized in Web Technologies and Software Engineering. Graduated with honors.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bachelor of Science in Computer Science</CardTitle>
              <CardDescription>2010 - 2014</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-primary mb-2">State University</p>
              <p className="text-muted-foreground">
                Focused on programming fundamentals, data structures, and algorithms. Participated in coding
                competitions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
