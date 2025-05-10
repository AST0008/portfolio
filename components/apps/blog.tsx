"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Edit, Trash2, Plus, Calendar, Tag, User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { type BlogPost, getPosts, createPost, updatePost, deletePost } from "@/app/actions/blog"

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    author: "You",
    tags: [],
    category: "Development",
  })
  const [newTagInput, setNewTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Get unique categories and tags
  const categories = Array.from(new Set(posts.map((post) => post.category)))
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  // Filter posts based on search, category, and tag
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesCategory = selectedCategory ? post.category === selectedCategory : true

    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true

    return matchesSearch && matchesCategory && matchesTag
  })

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return

    try {
      const createdPost = await createPost({
        title: newPost.title || "Untitled Post",
        excerpt: newPost.excerpt || newPost.content.substring(0, 150) + "...",
        content: newPost.content || "",
        author: newPost.author || "Anonymous",
        tags: newPost.tags || [],
        category: newPost.category || "Uncategorized",
        image: "/placeholder.svg?height=200&width=400",
      })

      setPosts([createdPost, ...posts])
      setIsCreating(false)
      setNewPost({
        title: "",
        excerpt: "",
        content: "",
        author: "You",
        tags: [],
        category: "Development",
      })
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  // Handle updating a post
  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      const updatedPost = await updatePost(editingPost.id, {
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        author: editingPost.author,
        tags: editingPost.tags,
        category: editingPost.category,
      })

      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setEditingPost(null)
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  // Handle deleting a post
  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
      if (viewingPost?.id === id) {
        setViewingPost(null)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  // Add tag to new post
  const addTagToNewPost = () => {
    if (!newTagInput.trim()) return

    if (isCreating) {
      setNewPost({
        ...newPost,
        tags: [...(newPost.tags || []), newTagInput.trim()],
      })
    } else if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: [...editingPost.tags, newTagInput.trim()],
      })
    }

    setNewTagInput("")
  }

  // Remove tag from new post
  const removeTagFromNewPost = (tag: string) => {
    if (isCreating) {
      setNewPost({
        ...newPost,
        tags: (newPost.tags || []).filter((t) => t !== tag),
      })
    } else if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: editingPost.tags.filter((t) => t !== tag),
      })
    }
  }

  // Render post content with markdown-like formatting
  const renderPostContent = (content: string) => {
    return <div className="blog-content" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
  }

  // Simple markdown-like formatter
  const formatContent = (content: string) => {
    let formatted = content
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Paragraphs
      .replace(/\n\n/g, "</p><p>")

    // Wrap in paragraph tags if not already
    if (!formatted.startsWith("<h1>") && !formatted.startsWith("<p>")) {
      formatted = "<p>" + formatted + "</p>"
    }

    return formatted
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  // If viewing a single post
  if (viewingPost) {
    return (
      <div className="h-full overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Button variant="ghost" className="mb-4" onClick={() => setViewingPost(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to posts
          </Button>

          <div className="mb-4">
            {viewingPost.image && (
              <img
                src={viewingPost.image || "/placeholder.svg"}
                alt={viewingPost.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{viewingPost.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4">
              <span className="flex items-center mr-4">
                <User className="w-4 h-4 mr-1" /> {viewingPost.author}
              </span>
              <span className="flex items-center mr-4">
                <Calendar className="w-4 h-4 mr-1" /> {format(new Date(viewingPost.date), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" /> {viewingPost.category}
              </span>
            </div>

            <div className="mb-4">
              {viewingPost.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">{renderPostContent(viewingPost.content)}</div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={() => setEditingPost(viewingPost)} className="flex items-center">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Post</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{viewingPost.title}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeletePost(viewingPost.id)}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    )
  }

  // If creating a new post
  if (isCreating || editingPost) {
    const post = editingPost || newPost

    return (
      <div className="h-full overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono text-primary">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h2>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreating(false)
                setEditingPost(null)
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, title: e.target.value })
                    : setNewPost({ ...newPost, title: e.target.value })
                }
                className="glass-input"
                placeholder="Post title"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={post.excerpt}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, excerpt: e.target.value })
                    : setNewPost({ ...newPost, excerpt: e.target.value })
                }
                className="glass-input"
                placeholder="Brief description of your post"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={post.content}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, content: e.target.value })
                    : setNewPost({ ...newPost, content: e.target.value })
                }
                className="glass-input min-h-[300px]"
                placeholder="Write your post content here... Supports markdown formatting"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={post.category}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, category: e.target.value })
                    : setNewPost({ ...newPost, category: e.target.value })
                }
                className="w-full p-2 rounded-md glass-input"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="Uncategorized">Uncategorized</option>
              </select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="glass-input"
                  placeholder="Add a tag"
                />
                <Button onClick={addTagToNewPost} type="button">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(editingPost ? editingPost.tags : newPost.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTagFromNewPost(tag)} className="ml-1 text-xs hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={editingPost ? handleUpdatePost : handleCreatePost}
                disabled={!post.title || !post.content}
                className="w-full"
              >
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Blog post list view
  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-mono text-primary">Blog</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsCreating(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </motion.div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {selectedTag && (
          <div className="flex items-center">
            <span className="mr-2">Filtered by tag:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedTag}
              <button onClick={() => setSelectedTag(null)} className="ml-1 text-xs hover:text-destructive">
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Card className="blog-card h-full flex flex-col">
                {post.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle
                        className="font-mono text-primary hover:text-primary/80 cursor-pointer"
                        onClick={() => setViewingPost(post)}
                      >
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(post.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <Badge>{post.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="blog-tag cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTag(tag)
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{post.author}</span>
                  <Button variant="ghost" onClick={() => setViewingPost(post)}>
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found. Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
