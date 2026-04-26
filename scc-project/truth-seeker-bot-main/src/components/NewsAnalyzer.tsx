import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionResult {
  prediction: "Fake" | "Real";
  label: number;
  confidence: number;
}

export const NewsAnalyzer = () => {
  const [newsText, setNewsText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  // Update this URL to your Flask backend URL
  const BACKEND_URL = "http://localhost:5000";

  const analyzeNews = async () => {
    if (!newsText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some news text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newsText }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze news");
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not connect to the analysis server. Make sure your Flask backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <label htmlFor="news-input" className="block text-sm font-semibold text-foreground">
          Enter News Article or Headline
        </label>
        <Textarea
          id="news-input"
          placeholder="Paste the news text you want to verify..."
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          className="min-h-[200px] text-base resize-none"
          disabled={isAnalyzing}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {newsText.length} characters
          </span>
          <Button
            onClick={analyzeNews}
            disabled={isAnalyzing || !newsText.trim()}
            size="lg"
            className="font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Newspaper className="mr-2 h-5 w-5" />
                Analyze News
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <Card className={`p-8 border-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
          result.prediction === "Real" 
            ? "border-success bg-success/5" 
            : "border-destructive bg-destructive/5"
        }`}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {result.prediction === "Real" ? (
                <div className="p-3 rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              ) : (
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {result.prediction === "Real" ? "Likely Real News" : "Likely Fake News"}
                </h3>
                <p className="text-muted-foreground">
                  {result.prediction === "Real"
                    ? "This content appears to be legitimate based on AI analysis."
                    : "This content shows signs of misinformation. Please verify with multiple sources."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Confidence Level</span>
                <span className="font-bold text-lg">{result.confidence.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    result.prediction === "Real" ? "bg-success" : "bg-destructive"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is an AI prediction. Always cross-reference with multiple reliable sources
                before drawing conclusions.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
