import ContainerLayout from "@/layout/ContainerLayout";

export default function Home() {
  return (
    <main>
      {/* === Hero Section === */}
      <section className="py-24 text-center bg-background text-foreground">
        <ContainerLayout>
          <div className="space-y-6">
            <h1 className="text-h1 font-coolvetica text-primary">
              32 Win
            </h1>
            <p className="text-body max-w-2xl mx-auto">
              Select numbers between <strong>0 and 32</strong>, place your bids, and win prizes instantly.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button className="px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-thunderbird-800 transition">
                Play Now
              </button>
              <button className="px-6 py-3 border border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition">
                Learn More
              </button>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* === About Section === */}
      <section className="py-20 bg-foreground text-background">
        <ContainerLayout>
          <div className="text-center space-y-4">
            <h2 className="text-h2 font-coolvetica">About 32 Win</h2>
            <p className="max-w-3xl mx-auto text-body">
              32 Win is a simple and exciting 2D lotto game designed for players who love strategy and luck.
              Pick any number between 0 and 32 — if your choice hits, you win! Built with a secure and transparent system.
            </p>
          </div>
        </ContainerLayout>
      </section>

      {/* === How It Works Section === */}
      <section className="py-20 bg-background text-foreground">
        <ContainerLayout>
          <div className="text-center space-y-8">
            <h2 className="text-h2 font-coolvetica">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-2xl bg-thunderbird-200/30">
                <h3 className="text-h3 mb-2 text-primary">1. Choose Numbers</h3>
                <p className="text-body">Pick any 6 numbers between 0 and 32 for your bid.</p>
              </div>
              <div className="p-6 rounded-2xl bg-thunderbird-200/30">
                <h3 className="text-h3 mb-2 text-primary">2. Place Your Bid</h3>
                <p className="text-body">Set your stake and confirm your play — quick and simple.</p>
              </div>
              <div className="p-6 rounded-2xl bg-thunderbird-200/30">
                <h3 className="text-h3 mb-2 text-primary">3. Win Prizes</h3>
                <p className="text-body">When your number combination matches, claim your prize instantly!</p>
              </div>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* === Footer === */}
      <footer className="py-12 bg-foreground text-background text-center">
        <ContainerLayout>
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} 32 Win. All rights reserved.
          </p>
        </ContainerLayout>
      </footer>
    </main>
  );
}
