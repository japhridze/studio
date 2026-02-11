import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { categories, products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featuredProducts = products.slice(0, 8);
  const saleImage = PlaceHolderImages.find(p => p.id === 'sale-banner');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
              Everything for Your Home, All in One Place
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              From building materials to home decor, find everything you need at Gorgia Online. Quality products, unbeatable prices.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="#featured-products">
                Shop Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                Shop by Category
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Explore our wide range of categories to find exactly what you're looking for.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.slice(0, 6).map((category) => (
                <Link href="#" key={category.id} className="group">
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-0 flex flex-col items-center justify-center text-center aspect-square">
                      <LayoutGrid className="w-10 h-10 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="featured-products" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Check out our best-sellers and top-rated items.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {saleImage && (
          <section className="container mx-auto px-4 my-12 md:my-20">
            <Card className="overflow-hidden bg-accent text-accent-foreground border-none">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12 lg:p-16 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-headline font-bold">
                    Big Summer Sale!
                  </h2>
                  <p className="mt-4 text-lg">
                    Up to 40% off on selected power tools and garden equipment. Don't miss out!
                  </p>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    <Link href="#">
                      Shop Sale Items
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 md:h-full min-h-[250px]">
                  <Image
                    src={saleImage.imageUrl}
                    alt={saleImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={saleImage.imageHint}
                  />
                </div>
              </div>
            </Card>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
