import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Heart, Calendar } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  featured: boolean
  visible: boolean
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string
  relatedProducts: string[]
}

interface HomePageProps {
  onNavigate: (page: 'shop' | 'blog' | 'contact', data?: any) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [products] = useKV<Product[]>('products', [])
  const [blogPosts] = useKV<BlogPost[]>('blog-posts', [])

  const featuredProducts = products
    .filter(p => p.visible && p.featured)
    .slice(0, 6)

  const latestPosts = blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="handwritten text-5xl lg:text-6xl font-bold text-foreground">
              Where Every Stitch
              <span className="text-accent block">Tells a Story</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover unique, handcrafted crochet pieces made with love and attention to detail. 
              Each creation carries the warmth of handmade artistry and the story of its making.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => onNavigate('shop')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-medium"
              >
                <ShoppingBag className="mr-2" size={20} />
                Shop Collection
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate('contact')}
                className="px-8 py-3 rounded-lg font-medium"
              >
                <Heart className="mr-2" size={20} />
                Request Custom Piece
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 gentle-shadow">
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart size={48} className="text-accent" />
                </div>
                <h3 className="handwritten text-2xl font-semibold mb-2">Featured Creation</h3>
                <p className="text-muted-foreground">
                  Each piece is lovingly crafted by hand, ensuring every detail reflects our passion for the art of crochet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="handwritten text-4xl font-semibold text-foreground mb-4">
              Featured Creations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved pieces, each one carefully crafted to bring warmth and beauty to your life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover-lift gentle-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <Heart size={48} className="text-accent/60" />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
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
                        onClick={() => onNavigate('shop')}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="handwritten text-4xl font-semibold text-foreground mb-4">
              Latest Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dive into the inspiration and process behind each creation. Every piece has a story waiting to be told.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Card key={post.id} className="group hover-lift gentle-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Calendar size={32} className="text-accent/60" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('blog')}
                      className="w-full"
                    >
                      Read Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Commission CTA */}
      <section className="py-16">
        <Card className="bg-gradient-to-r from-primary to-secondary gentle-shadow">
          <CardContent className="p-12 text-center">
            <h2 className="handwritten text-4xl font-semibold text-foreground mb-4">
              Have Something Special in Mind?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Let's create something uniquely yours. From custom colors to personalized designs, 
              every commissioned piece is crafted with your vision in mind.
            </p>
            <Button 
              onClick={() => onNavigate('contact')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg"
            >
              <Heart className="mr-2" size={24} />
              Start Your Custom Order
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}