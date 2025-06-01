import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Home, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function ErrorPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isRetrying, setIsRetrying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [controls]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const glitchVariants = {
    initial: { x: 0 },
    glitch: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.3,
        repeat: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground relative flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sa-primary/20 rounded-full blur-3xl animate-pulse dark:bg-primary/20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-muted/30 rounded-full"
          animate={{
            x: mousePosition.x * 0.015,
            y: mousePosition.y * 0.015,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="absolute top-0 left-0 right-0 backdrop-blur-xl bg-muted/5 border-b border-border z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-8 h-8 text-white bg-sa-primary rounded-lg flex items-center justify-center"
            >
              <Brain className="w-5 h-5" />
            </motion.div>
            <h1 className="text-xl font-bold bg-sa-primary bg-clip-text text-transparent dark:from-primary dark:to-accent">
              SummAid
            </h1>
          </Link>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 space-y-8 max-w-2xl mx-auto">
        <motion.div animate={controls} className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="w-32 h-32 bg-sa-primary rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 mb-8"
          >
            <AlertTriangle className="w-16 h-16 text-white" />
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-sa-primary/20 border border-sa-primary/30 text-primary text-sm text-sa-primary backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Error 404 - Page Not Found
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4"
        >
          <motion.h2
            variants={glitchVariants}
            initial="initial"
            animate="initial"
            whileHover="glitch"
            className="text-5xl sm:text-6xl font-bold leading-tight"
          >
            <span className="bg-sa-primary bg-clip-text text-transparent dark:from-sa-primary dark:to-accent">
              Oops!
            </span>
            <br />
            <span className="bg-sa-primary bg-clip-text text-transparent dark:from-sa-primary dark:to-accent">
              Lost in Space
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl max-w-lg mx-auto leading-relaxed dark:text-muted-foreground text-zinc-700"
          >
            The page you're looking for seems to have vanished into the digital
            void. But don't worry – even the best explorers sometimes take a
            wrong turn.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center pt-4"
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-sa-primary hover:bg-sa-primary/90 px-8 py-6 text-lg font-semibold rounded-full shadow-2xl border-0 group"
              >
                <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Go Home
              </Button>
            </motion.div>
          </Link>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleRetry}
              disabled={isRetrying}
              className="backdrop-blur-sm bg-muted/10 hover:bg-muted/20 border border-sa-primary px-8 py-6 text-lg text-sa-primary font-semibold rounded-full group disabled:opacity-50"
            >
              <motion.div
                animate={{ rotate: isRetrying ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: isRetrying ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw className="mr-2 w-5 h-5" />
              </motion.div>
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="pt-8 text-muted-foreground text-sm max-w-md mx-auto"
        >
          <p>
            If you believe this is a mistake, please contact our support team.
            We're here to help you get back on track with your learning journey.
          </p>
        </motion.div>

        <motion.div
          className="absolute -z-10 opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-96 h-96 border border-dashed border-primary/30 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
