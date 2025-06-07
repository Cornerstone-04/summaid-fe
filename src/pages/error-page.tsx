import { Button } from "@/components/ui/button";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function ErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sa-primary/10 text-foreground relative p-4">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 space-y-8  mx-auto">
        <div className="w-28 h-28 bg-sa-primary rounded-full flex items-center justify-center shadow-xl">
          <AlertTriangle className="w-14 h-14 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-sa-primary">
            Oops!
          </h1>
          <p className="text-lg max-w-lg mx-auto leading-relaxed text-sa-primary/70">
            The page you're looking for seems to have vanished. It might have
            been moved, deleted, or never existed.
          </p>
        </div>
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
