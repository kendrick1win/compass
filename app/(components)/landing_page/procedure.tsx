export default function ProcedureSection() {
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">
              How Compass Works
            </h2>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="w-16 h-16 rounded-full bg-foreground text-background dark:bg-[#e5e5e5] dark:text-[#121212] flex items-center justify-center mb-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-2xl font-light mb-4">
                    Create Your Profile
                  </h3>
                  <p className="text-muted-foreground">
                    Answer a few questions about yourself to generate your
                    personal aspect profile, revealing your strengths and areas
                    for growth.
                  </p>
                </div>
                <div className="md:w-1/2 border border-border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-secondary/30"></div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="w-16 h-16 rounded-full bg-foreground text-background dark:bg-[#e5e5e5] dark:text-[#121212] flex items-center justify-center mb-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-2xl font-light mb-4">
                    Receive Daily Insights
                  </h3>
                  <p className="text-muted-foreground">
                    Get personalized daily guidance based on your aspect
                    profile, including optimal times for activities and focus
                    areas.
                  </p>
                </div>
                <div className="md:w-1/2 border border-border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-secondary/30"></div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="w-16 h-16 rounded-full bg-foreground text-background dark:bg-[#e5e5e5] dark:text-[#121212] flex items-center justify-center mb-4">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="text-2xl font-light mb-4">Ask Compass</h3>
                  <p className="text-muted-foreground">
                    Get answers to your questions about personal growth,
                    relationships, and life direction based on your unique
                    profile.
                  </p>
                </div>
                <div className="md:w-1/2 border border-border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-secondary/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
