"use server"

import { revalidatePath } from "next/cache"

// Types
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: Date
  tags: string[]
  category: string
  image?: string
}

// Sample data - in a real app, this would be in a database
let samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt: "Learn how to build modern web applications with Next.js 14 and its new features.",
    content: `
# Getting Started with Next.js 14

Next.js 14 introduces several exciting features that make building web applications even more enjoyable. Let's explore some of the key highlights:

## Server Components

Server Components allow you to render components on the server, reducing the JavaScript sent to the client and improving performance.

\`\`\`jsx
// app/page.tsx
export default function Page() {
  return <h1>This is a Server Component</h1>
}
\`\`\`

## Improved Routing

The App Router provides a more intuitive way to define routes in your application:

\`\`\`jsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <div>Post: {params.slug}</div>
}
\`\`\`

## Server Actions

Server Actions allow you to define server-side functions that can be called from the client:

\`\`\`jsx
'use server'

export async function submitForm(formData) {
  // Process form data on the server
}
\`\`\`

These features make Next.js 14 a powerful framework for building modern web applications.
    `,
    author: "Jane Developer",
    date: new Date("2023-11-15"),
    tags: ["Next.js", "React", "Web Development"],
    category: "Development",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Mastering TypeScript for React Development",
    excerpt: "Improve your React applications with TypeScript's type safety and developer experience.",
    content: `
# Mastering TypeScript for React Development

TypeScript provides type safety and improved developer experience for React applications. Here's how to get the most out of it:

## Type-Safe Props

Define interfaces for your component props:

\`\`\`tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
\`\`\`

## Custom Hooks with TypeScript

Create type-safe custom hooks:

\`\`\`tsx
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return { count, increment, decrement };
}
\`\`\`

TypeScript makes your React code more robust and maintainable.
    `,
    author: "Alex TypeScript",
    date: new Date("2023-10-28"),
    tags: ["TypeScript", "React", "JavaScript"],
    category: "Development",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "Building a Portfolio with Glassmorphism Design",
    excerpt: "Create a stunning portfolio website using the popular glassmorphism design trend.",
    content: `
# Building a Portfolio with Glassmorphism Design

Glassmorphism is a design trend that creates a frosted glass effect for UI elements. Here's how to implement it in your portfolio:

## CSS Implementation

The key to glassmorphism is using backdrop-filter and appropriate transparency:

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
\`\`\`

## Design Considerations

- Use subtle, colorful backgrounds to enhance the glass effect
- Maintain good contrast for accessibility
- Don't overuse the effect - apply it strategically

Glassmorphism can make your portfolio stand out while maintaining a modern, clean aesthetic.
    `,
    author: "Sam Designer",
    date: new Date("2023-09-15"),
    tags: ["Design", "CSS", "UI/UX"],
    category: "Design",
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Server actions
export async function getPosts() {
  return samplePosts
}

export async function getPostById(id: string) {
  return samplePosts.find((post) => post.id === id) || null
}

export async function createPost(postData: Omit<BlogPost, "id" | "date">) {
  const newPost: BlogPost = {
    id: Date.now().toString(),
    date: new Date(),
    ...postData,
  }

  samplePosts = [newPost, ...samplePosts]
  revalidatePath("/")
  return newPost
}

export async function updatePost(id: string, postData: Partial<Omit<BlogPost, "id">>) {
  const postIndex = samplePosts.findIndex((post) => post.id === id)

  if (postIndex === -1) {
    throw new Error(`Post with id ${id} not found`)
  }

  samplePosts[postIndex] = {
    ...samplePosts[postIndex],
    ...postData,
  }

  revalidatePath("/")
  return samplePosts[postIndex]
}

export async function deletePost(id: string) {
  const postIndex = samplePosts.findIndex((post) => post.id === id)

  if (postIndex === -1) {
    throw new Error(`Post with id ${id} not found`)
  }

  const deletedPost = samplePosts[postIndex]
  samplePosts = samplePosts.filter((post) => post.id !== id)

  revalidatePath("/")
  return deletedPost
}
