import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, Heart, ShoppingBag, Tag } from '@phosphor-icons/react'
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

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  visible: boolean
}

interface BlogPostProps {
  post: BlogPost
  onBack: () => void
  onProductSelect: (product: Product) => void
}

export default function BlogPost({ post, onBack, onProductSelect }: BlogPostProps) {
  const [products] = useKV<Product[]>('products', [])

  // Get related products that are visible
  const relatedProducts = products.filter(p => 
    p.visible && post.relatedProducts.includes(p.id)
  )

  // Convert markdown-style content to HTML-like JSX (simplified)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-foreground leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Stories
        </Button>
      </div>

      {/* Article */}
      <article className="space-y-8">
        {/* Hero Image */}
        <div className="aspect-video bg-muted rounded-xl flex items-center justify-center gentle-shadow">
          <Calendar size={64} className="text-accent/60" />
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {post.readTime} min read
            </div>
          </div>

          <h1 className="handwritten text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                <Tag size={12} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg leading-relaxed">
            {renderContent(post.content)}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="handwritten text-3xl font-semibold text-foreground mb-6 text-center">
              Featured in This Story
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="group hover-lift gentle-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                      <Heart size={48} className="text-accent/60" />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">
                          ${product.price}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => onProductSelect(product)}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          <ShoppingBag className="mr-1" size={16} />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary to-secondary gentle-shadow">
          <CardContent className="p-8 text-center">
            <h3 className="handwritten text-2xl font-semibold text-foreground mb-3">
              Inspired by This Story?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every piece tells a story. Browse our collection to find your next chapter, 
              or let us create something uniquely yours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={onBack}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Heart className="mr-2" size={20} />
                Read More Stories
              </Button>
              <Button 
                variant="outline"
                onClick={() => {/* Navigate to shop */}}
              >
                <ShoppingBag className="mr-2" size={20} />
                Browse Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}