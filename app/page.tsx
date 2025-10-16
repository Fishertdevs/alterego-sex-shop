import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/products/featured-products"
import { ReviewsSection } from "@/components/reviews/reviews-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28">
        <HeroSection />
        <FeaturedProducts />
        <ReviewsSection />
      </div>
    </main>
  )
}
