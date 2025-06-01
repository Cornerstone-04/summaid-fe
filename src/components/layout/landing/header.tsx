import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Link } from "react-router";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#0657E7] rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-[#0657E7] bg-clip-text text-transparent">
            SummAid
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button className="text-sm font-semibold bg-[#0657E7] hover:bg-[#054ed0] text-white">
              Get Started
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
};
