import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Heart, MapPin, User, Mail, Phone, CheckCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

interface ShippingInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  product: Product
  shipping: ShippingInfo
  orderDate: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  trackingNumber?: string
}

interface ProductCheckoutProps {
  product: Product
  onBack: () => void
}

export default function ProductCheckout({ product, onBack }: ProductCheckoutProps) {
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateShipping = () => {
    const required = ['fullName', 'email', 'address', 'city', 'state', 'zipCode']
    return required.every(field => shippingInfo[field as keyof ShippingInfo]?.trim())
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateShipping()) {
      toast.error('Please fill in all required shipping information')
      return
    }
    setCurrentStep('payment')
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate Stripe Checkout Session creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        product,
        shipping: shippingInfo,
        orderDate: new Date().toISOString(),
        status: 'pending'
      }
      
      setOrders(current => [...current, newOrder])
      setCompletedOrder(newOrder)
      setCurrentStep('confirmation')
      
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (currentStep === 'confirmation' && completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="gentle-shadow">
          <CardContent className="p-8 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
            <h1 className="handwritten text-3xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase! Your handcrafted piece will be lovingly created and shipped to you.
            </p>
            
            <div className="bg-muted rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-medium">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium">{completedOrder.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">${completedOrder.product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping to:</span>
                  <span className="font-medium">{completedOrder.shipping.fullName}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              <p>We'll send a confirmation email to <strong>{completedOrder.shipping.email}</strong></p>
              <p>Estimated delivery: 2-4 weeks</p>
            </div>
            
            <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Button>
        <h1 className="handwritten text-3xl font-bold text-foreground">
          Checkout
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === 'shipping' ? 'text-accent' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'shipping' ? 'border-accent bg-accent text-accent-foreground' : 'border-muted-foreground'
            }`}>
              1
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-accent' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'payment' ? 'border-accent bg-accent text-accent-foreground' : 'border-muted-foreground'
            }`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'shipping' && (
            <Card className="gentle-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleShippingChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 'payment' && (
            <Card className="gentle-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll be redirected to our secure payment processor to complete your purchase.
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>SSL Encrypted & Secure</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('shipping')}
                    className="flex-1"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2" />
                        Processing...
                      </div>
                    ) : (
                      'Complete Order'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="gentle-shadow sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Heart size={24} className="text-accent/60" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {product.category}
                  </Badge>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-accent">${product.price}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Handcrafted to order</p>
                <p>• 2-4 week delivery time</p>
                <p>• Free shipping within US</p>
                <p>• 30-day satisfaction guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}