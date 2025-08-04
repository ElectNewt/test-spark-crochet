import { useState } from 'react'
import { ArrowLeft, Heart, ShoppingCart, Star, Package, Truck, Shield } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface ProductPageProps {
  product: any
  onBack: () => void
  onBuyNow: (product: any) => void
}

export default function ProductPage({ product, onBack, onBuyNow }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  // Mock additional product images - in real app this would come from product data
  const productImages = [
    product.image,
    product.image, // Placeholder - would be different angles
    product.image, // Placeholder - would be detail shots
  ]

  const handleBuyNow = () => {
    onBuyNow({ ...product, quantity })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden gentle-shadow">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-1 aspect-square bg-card rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-accent' : 'border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="handwritten text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`${isFavorited ? 'text-accent' : 'text-muted-foreground'}`}
                >
                  <Heart size={24} weight={isFavorited ? 'fill' : 'regular'} />
                </Button>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      weight="fill"
                      className={i < 4 ? 'text-yellow-400' : 'text-muted'}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-accent mb-6">
                ${product.price}
              </div>
            </div>

            {/* Product Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                {product.description || 
                  `Beautifully handcrafted ${product.name.toLowerCase()}, made with love and attention to detail. Each piece is unique and crafted using premium yarns in soft, comfortable textures. Perfect for cozy moments or as a thoughtful gift for someone special.`
                }
              </p>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <span className="ml-2 text-foreground">100% Cotton Yarn</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Care:</span>
                  <span className="ml-2 text-foreground">Hand Wash</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Made in:</span>
                  <span className="ml-2 text-foreground">Small Batches</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time to Make:</span>
                  <span className="ml-2 text-foreground">3-5 Days</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
              >
                <ShoppingCart size={20} className="mr-2" />
                Buy Now - ${(product.price * quantity).toFixed(2)}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Secure checkout powered by Stripe
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Package size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Handmade with Care</p>
              </div>
              <div className="text-center">
                <Truck size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Fast Shipping</p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Satisfaction Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="handwritten text-2xl font-bold text-foreground mb-8 text-center">
            You Might Also Love
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Mock related products - in real app this would be actual data */}
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="hover-lift cursor-pointer bg-card">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground mb-1">Related Item {index + 1}</h3>
                  <p className="text-accent font-semibold">$29.99</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}