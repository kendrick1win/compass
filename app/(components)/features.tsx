export default function FeaturesSection() {
  return (
    <>
      <section className="bg-secondary/50 dark:bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Find Your Balance</h2>
            <p className="text-lg text-muted-foreground">
              Compass helps you understand your personal aspects and provides
              daily guidance for mindful living
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">S</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Stability</h3>
              <p className="text-muted-foreground">
                Discover your grounding elements and learn how to maintain
                balance in challenging times.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">C</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Clarity</h3>
              <p className="text-muted-foreground">
                Gain insights into your thought patterns and develop focus for
                better decision-making.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-background">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl">F</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Flow</h3>
              <p className="text-muted-foreground">
                Learn to adapt to life's changes with grace and develop your
                intuitive abilities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
