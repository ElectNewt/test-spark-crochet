import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Mail, Phone, User, Camera, Send } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ContactForm {
  name: string
  email: string
  phone: string
  description: string
  referenceImage?: File
}

interface CommissionRequest {
  id: string
  name: string
  email: string
  phone: string
  description: string
  referenceImageUrl?: string
  submittedAt: string
  status: 'pending' | 'contacted' | 'completed'
}

export default function ContactPage() {
  const [commissionRequests, setCommissionRequests] = useKV<CommissionRequest[]>('commission-requests', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    description: ''
  })

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, referenceImage: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.email || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const newRequest: CommissionRequest = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        description: form.description,
        referenceImageUrl: form.referenceImage ? `uploaded-${Date.now()}.jpg` : undefined,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }

      setCommissionRequests(current => [...current, newRequest])

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        description: ''
      })

      toast.success('Your custom order request has been submitted! We\'ll be in touch soon.')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="handwritten text-5xl font-bold text-foreground mb-4">
          Let's Create Something Special
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Have a vision for a custom crochet piece? Share your ideas with us and we'll bring them to life. 
          From baby blankets to home décor, every commission is crafted with love and attention to detail.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="gentle-shadow">
          <CardHeader>
            <CardTitle className="handwritten text-2xl text-foreground flex items-center">
              <Heart className="mr-2 text-accent" size={24} />
              Commission Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User size={16} className="mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center">
                  <Heart size={16} className="mr-2" />
                  Describe Your Vision *
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your dream piece! Include details like size, colors, style, intended use, timeline, and any special requirements."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference-image" className="flex items-center">
                  <Camera size={16} className="mr-2" />
                  Reference Photo (Optional)
                </Label>
                <Input
                  id="reference-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an inspiration photo, sketch, or example of what you have in mind
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2" />
                    Sending Request...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="mr-2" size={20} />
                    Submit Commission Request
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info & FAQ */}
        <div className="space-y-8">
          <Card className="gentle-shadow">
            <CardHeader>
              <CardTitle className="handwritten text-2xl text-foreground">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Share Your Vision</h4>
                  <p className="text-muted-foreground text-sm">
                    Tell us about your dream piece, including colors, size, and style preferences.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Design Consultation</h4>
                  <p className="text-muted-foreground text-sm">
                    We'll discuss your project, provide a quote, and create a design plan together.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Handcrafted Creation</h4>
                  <p className="text-muted-foreground text-sm">
                    Your piece is lovingly crafted by hand with updates throughout the process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gentle-shadow">
            <CardHeader>
              <CardTitle className="handwritten text-2xl text-foreground">
                Commission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Timeline</h4>
                <p className="text-muted-foreground text-sm">
                  Most custom pieces take 2-4 weeks to complete, depending on complexity and current queue.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p className="text-muted-foreground text-sm">
                  Commission pricing is based on materials, time, and complexity. You'll receive a detailed quote before work begins.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Materials</h4>
                <p className="text-muted-foreground text-sm">
                  We use only premium yarns and materials, with options for different fibers, colors, and textures.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary gentle-shadow">
            <CardContent className="p-6 text-center">
              <h3 className="handwritten text-xl font-semibold text-foreground mb-2">
                Ready to Start?
              </h3>
              <p className="text-muted-foreground text-sm">
                We typically respond to commission requests within 24 hours. 
                Let's create something beautiful together!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}