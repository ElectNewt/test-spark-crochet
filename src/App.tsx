import { useState } from 'react'
import { ShoppingBag, BookOpen, MessageCircle, Menu, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import HomePage from '@/components/pages/HomePage'
import ShopPage from '@/components/pages/ShopPage'
import BlogPage from '@/components/pages/BlogPage'
import ContactPage from '@/components/pages/ContactPage'
import ProductCheckout from '@/components/pages/ProductCheckout'
import ProductPage from '@/components/pages/ProductPage'
import BlogPost from '@/components/pages/BlogPost'

type Page = 'home' | 'shop' | 'blog' | 'contact' | 'product' | 'checkout' | 'blog-post'

interface AppState {
  currentPage: Page
  selectedProduct?: any
  selectedBlogPost?: any
  mobileMenuOpen: boolean
}

function App() {
  const [state, setState] = useState<AppState>({
    currentPage: 'home',
    mobileMenuOpen: false
  })
  const isMobile = useIsMobile()

  const navigateTo = (page: Page, data?: any) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      selectedProduct: page === 'product' ? data : page === 'checkout' ? data : prev.selectedProduct,
      selectedBlogPost: page === 'blog-post' ? data : prev.selectedBlogPost,
      mobileMenuOpen: false
    }))
  }

  const toggleMobileMenu = () => {
    setState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }))
  }

  const renderPage = () => {
    switch (state.currentPage) {
      case 'shop':
        return <ShopPage onProductSelect={(product) => navigateTo('product', product)} />
      case 'blog':
        return <BlogPage onPostSelect={(post) => navigateTo('blog-post', post)} />
      case 'contact':
        return <ContactPage />
      case 'product':
        return <ProductPage 
          product={state.selectedProduct} 
          onBack={() => navigateTo('shop')} 
          onBuyNow={(product) => navigateTo('checkout', product)} 
        />
      case 'checkout':
        return <ProductCheckout product={state.selectedProduct} onBack={() => navigateTo('product', state.selectedProduct)} />
      case 'blog-post':
        return <BlogPost post={state.selectedBlogPost} onBack={() => navigateTo('blog')} onProductSelect={(product) => navigateTo('product', product)} />
      default:
        return <HomePage onNavigate={navigateTo} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => navigateTo('home')}
              className="handwritten text-2xl font-bold text-foreground hover:text-accent transition-colors"
            >
              Yarn & Stories
            </button>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-8">
                <button
                  onClick={() => navigateTo('shop')}
                  className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span>Shop</span>
                </button>
                <button
                  onClick={() => navigateTo('blog')}
                  className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors"
                >
                  <BookOpen size={20} />
                  <span>Stories</span>
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors"
                >
                  <MessageCircle size={20} />
                  <span>Custom Orders</span>
                </button>
              </nav>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-foreground"
              >
                {state.mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMobile && state.mobileMenuOpen && (
            <nav className="pb-4 border-t border-border mt-4 pt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigateTo('shop')}
                  className="flex items-center space-x-3 text-foreground hover:text-accent transition-colors text-left"
                >
                  <ShoppingBag size={20} />
                  <span>Shop</span>
                </button>
                <button
                  onClick={() => navigateTo('blog')}
                  className="flex items-center space-x-3 text-foreground hover:text-accent transition-colors text-left"
                >
                  <BookOpen size={20} />
                  <span>Stories</span>
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="flex items-center space-x-3 text-foreground hover:text-accent transition-colors text-left"
                >
                  <MessageCircle size={20} />
                  <span>Custom Orders</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="page-transition">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="handwritten text-xl font-semibold text-foreground mb-2">
              Yarn & Stories
            </h3>
            <p className="text-muted-foreground text-sm">
              Handcrafted with love, one stitch at a time
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              © 2024 Yarn & Stories. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App