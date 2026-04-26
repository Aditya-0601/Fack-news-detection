import { NewsAnalyzer } from "@/components/NewsAnalyzer";
import { Shield, Brain, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Fake News Detector
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-display font-black text-foreground leading-tight">
            Verify News with{" "}
            <span className="text-primary">AI Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by a fine-tuned BERT model, our system analyzes news content
            to help you identify potential misinformation.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">BERT Model</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">High Accuracy</span>
          </div>
        </div>
      </section>

      {/* Main Analyzer */}
      <section className="container mx-auto px-4 pb-20">
        <NewsAnalyzer />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            This tool uses AI for detection and may not be 100% accurate. Always verify
            information with trusted sources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
