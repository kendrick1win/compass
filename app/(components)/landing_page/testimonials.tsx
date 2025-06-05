import { Star } from "lucide-react";
export default function TestimonialSection() {
  return (
    <>
      <section className="bg-secondary/50 dark:bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-light mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Discover how Compass has helped people find balance and direction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <p className="mb-4">
                "Compass has helped me understand my strengths and weaknesses in
                a whole new way. The daily insights are spot on!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary"></div>
                <div>
                  <p className="font-medium">Sarah K.</p>
                  <p className="text-sm text-muted-foreground">
                    Growth Archetype
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <p className="mb-4">
                "I've tried many self-improvement apps, but Compass actually
                feels personalized to me. The balance tips have been
                transformative."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary"></div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-muted-foreground">
                    Flow Archetype
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <p className="mb-4">
                "The Ask feature is like having a personal coach. It's helped me
                navigate some difficult decisions with clarity."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary"></div>
                <div>
                  <p className="font-medium">Aisha J.</p>
                  <p className="text-sm text-muted-foreground">
                    Clarity Archetype
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
