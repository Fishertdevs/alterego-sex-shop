import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/products/featured-products"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { SocialLinks } from "@/components/social/social-links"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <ReviewsSection />
      <SocialLinks />
    </main>
  )
}
