import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router";

export const Hero = () => {
  const demoVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  return (
    <motion.main
      style={{ y: y1, opacity }}
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 space-y-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-[#0657E7]/10 border border-[#0657E7]/20 text-[#0657E7] text-sm mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Study Revolution
        </motion.div>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          <span className="bg-gradient-to-r from-foreground via-[#0657E7] to-blue-400 bg-clip-text text-transparent">
            Study
          </span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-gradient-to-r from-[#0657E7] to-blue-500 bg-clip-text text-transparent"
          >
            Revolutionized
          </motion.span>
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          SummAid helps you master complex topics faster with AI-powered
          summaries, smart flashcards, and voice-based study guides.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Link to="/auth/get-started">
          <Button
            size="lg"
            className="px-8 py-6 rounded-full text-base bg-[#0657E7] hover:bg-[#054ed0] text-white"
          >
            Start Learning Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="backdrop-blur-sm bg-muted/30 hover:bg-muted/40 border px-8 py-6 rounded-full"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full aspect-video p-0 overflow-hidden">
            <iframe
              className="w-full h-full rounded-md"
              src={demoVideoUrl}
              title="SummAid Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.main>
  );
};
