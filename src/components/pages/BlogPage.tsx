import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ChevronLeft, ChevronRight } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  publishedAt: string
  readTime: number
  tags: string[]
  relatedProducts: string[]
}

interface BlogPageProps {
  onPostSelect: (post: BlogPost) => void
}

const POSTS_PER_PAGE = 10

export default function BlogPage({ onPostSelect }: BlogPageProps) {
  const [blogPosts] = useKV<BlogPost[]>('blog-posts', [])
  const [currentPage, setCurrentPage] = useState(1)

  // Sort posts by publish date (newest first)
  const sortedPosts = blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="handwritten text-5xl font-bold text-foreground mb-4">
          Stories & Inspiration
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover the stories behind each creation, the inspiration that drives our craft, 
          and the journey from yarn to finished piece.
        </p>
      </div>

      {/* Blog Posts */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No stories yet</h3>
          <p className="text-muted-foreground">
            Check back soon for inspiring stories and behind-the-scenes content!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {currentPosts.map((post) => (
            <Card key={post.id} className="hover-lift gentle-shadow group cursor-pointer" onClick={() => onPostSelect(post)}>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="aspect-video md:aspect-square bg-muted flex items-center justify-center rounded-l-lg">
                    <Calendar size={48} className="text-accent/60" />
                  </div>
                  
                  {/* Content */}
                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <Clock size={16} className="ml-4 mr-2" />
                      {post.readTime} min read
                    </div>
                    
                    <h2 className="font-bold text-xl mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Read Full Story
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className={currentPage === page ? "bg-accent text-accent-foreground" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Stats */}
      {sortedPosts.length > 0 && (
        <div className="text-center mt-12 p-6 bg-card rounded-lg gentle-shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-accent">{sortedPosts.length}</div>
              <div className="text-sm text-muted-foreground">Stories Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {Math.round(sortedPosts.reduce((acc, post) => acc + post.readTime, 0) / sortedPosts.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Read Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {Array.from(new Set(sortedPosts.flatMap(post => post.tags))).length}
              </div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {sortedPosts.filter(post => 
                  new Date(post.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}