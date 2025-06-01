import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, Brain, Headphones, Zap } from "lucide-react";

export const Features = () => {
  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const features = [
    {
      icon: Brain,
      title: "AI Summaries",
      desc: "Intelligent content extraction",
    },
    {
      icon: BookOpen,
      title: "Smart Flashcards",
      desc: "Adaptive learning cards",
    },
    { icon: Headphones, title: "Audio Recaps", desc: "Listen on the go" },
    { icon: Zap, title: "Instant Analysis", desc: "Real-time insights" },
  ];

  return (
    <motion.section style={{ y: y2 }} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground to-[#0657E7] bg-clip-text text-transparent"
        >
          Powerful Features for Modern Learning
        </motion.h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-muted/20 p-8 rounded-2xl border border-border hover:border-[#0657E7]/50 transition-all group"
            >
              <div className="w-12 h-12 bg-[#0657E7] rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
