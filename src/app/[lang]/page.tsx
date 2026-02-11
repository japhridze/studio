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
import { getDictionary } from "@/lib/dictionaries";

export default async function Home({ params: { lang } }: { params: { lang: 'en' | 'ka' } }) {
  const dict = await getDictionary(lang);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featuredProducts = products.slice(0, 8);
  const saleImage = PlaceHolderImages.find(p => p.id === 'sale-banner');

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} dictionary={dict} />
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
              {dict.homepage.heroTitle}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              {dict.homepage.heroSubtitle}
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="#featured-products">
                {dict.homepage.shopNow} <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                {dict.homepage.shopByCategory}
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                {dict.homepage.shopByCategorySubtitle}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.slice(0, 6).map((category) => (
                <Link href={`/${lang}/products`} key={category.id} className="group">
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
                {dict.homepage.featuredProducts}
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                {dict.homepage.featuredProductsSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} dictionary={dict.productCard} lang={lang} />
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
                    {dict.homepage.summerSale}
                  </h2>
                  <p className="mt-4 text-lg">
                    {dict.homepage.summerSaleSubtitle}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    <Link href="#">
                      {dict.homepage.shopSaleItems}
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
      <Footer lang={lang} dictionary={dict.footer} />
    </div>
  );
}
