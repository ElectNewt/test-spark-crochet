import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, ShoppingBag, Search } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  featured: boolean
  visible: boolean
  inStock: boolean
}

interface ShopPageProps {
  onProductSelect: (product: Product) => void
}

export default function ShopPage({ onProductSelect }: ShopPageProps) {
  const [products] = useKV<Product[]>('products', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  // Filter visible products only
  const visibleProducts = products.filter(p => p.visible)

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(visibleProducts.map(p => p.category)))]

  // Filter and sort products
  const filteredProducts = visibleProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="handwritten text-5xl font-bold text-foreground mb-4">
          Our Collection
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Each piece is lovingly handcrafted with premium yarns and careful attention to detail. 
          Find the perfect addition to your home or a thoughtful gift for someone special.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 mb-8 gentle-shadow">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Check back soon for new creations!"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover-lift gentle-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center relative">
                    <Heart size={48} className="text-accent/60" />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                        Featured
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary" className="absolute top-3 right-3">
                        Out of Stock
                      </Badge>
                    )}
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
                        disabled={!product.inStock}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                      >
                        <ShoppingBag className="mr-1" size={16} />
                        {product.inStock ? 'Buy Now' : 'Unavailable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}