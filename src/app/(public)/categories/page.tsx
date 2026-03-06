import Link from "next/link";
import { getCategoriesWithCount } from "@/services/public-event.service";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Categories",
  description: "Browse events by category — music, tech, business, sports, and more.",
};

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="container-main py-12">
      <h1 className="text-brand-charcoal text-3xl font-bold">Event Categories</h1>
      <p className="text-brand-soft-black mt-2">
        Browse events by category to find exactly what you&apos;re looking for.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-orange/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Tag className="text-brand-orange h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-brand-charcoal group-hover:text-brand-orange font-semibold transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-brand-sage text-xs">
                      {cat.eventCount} event{cat.eventCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-brand-sage group-hover:text-brand-orange h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
