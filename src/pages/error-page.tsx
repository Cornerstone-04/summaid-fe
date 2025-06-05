import { Button } from "@/components/ui/button";
import { Home, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function ErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sa-primary/10 text-foreground relative p-4">
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 space-y-8  mx-auto">
        {/* Error Icon */}
        <div className="w-28 h-28 bg-sa-primary rounded-full flex items-center justify-center shadow-xl">
          <AlertTriangle className="w-14 h-14 text-white" />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-sa-primary/10 border border-sa-primary/20  text-sm backdrop-blur-sm text-sa-primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Error 404 - Page Not Found
        </div>

        {/* Main Heading and Description */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-sa-primary">
            Oops! Lost in Space
          </h1>
          <p className="text-lg max-w-lg mx-auto leading-relaxed text-sa-primary/70">
            The page you're looking for seems to have vanished. It might have
            been moved, deleted, or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
          <Link to="/">
            <Button
              size="lg"
              className="bg-sa-primary hover:bg-sa-primary/90 px-8 py-6 text-lg font-semibold rounded-full shadow-lg group"
            >
              <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-8 py-6 text-lg font-semibold rounded-full group disabled:opacity-50 border-2 border-sa-primary text-sa-primary bg-sa-primary/10 hover:bg-sa-primary hover:text-white transition-colors"
          >
            <div>
              <RefreshCw className="mr-2 w-5 h-5" />
            </div>
            {isRetrying ? "Retrying..." : "Try Again"}
          </Button>
        </div>
      </div>
    </div>
  );
}
