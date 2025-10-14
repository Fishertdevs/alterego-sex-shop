import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/products/featured-products"
import { PaymentMethodsSection } from "@/components/payment-methods-section"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { SocialLinks } from "@/components/social/social-links"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <PaymentMethodsSection />
      <ReviewsSection />
      <SocialLinks />
    </main>
  )
}
