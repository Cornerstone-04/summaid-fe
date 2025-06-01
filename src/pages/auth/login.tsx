import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";
import { MdWavingHand } from "react-icons/md";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const { user } = useAuth();

  const handleGoogleLogin = () => {
    login(undefined, {
      onSuccess: () => {
        toast.success("Login successful!", {
          description: "Welcome to SummAid",
        });
      },
      onError: (err: unknown) => {
        console.error("Login failed:", err);
        toast.error("Login failed. Try again.");
      },
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-muted/40 border border-border backdrop-blur-xl p-8 rounded-2xl shadow-lg space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-sa-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-sa-primary bg-clip-text text-transparent">
            SummAid
          </h1>
        </div>

        <h2 className="text-center text-lg font-semibold">
          Welcome back <MdWavingHand className="text-sa-primary inline" />
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Sign in to continue your learning journey.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
            Login failed. Please try again.
          </div>
        )}

        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full justify-center gap-2 bg-sa-primary hover:bg-[#054ed0]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
