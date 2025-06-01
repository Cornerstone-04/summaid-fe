import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

export const MeetTheBuilder = () => {
  return (
    <section className="px-4 pb-24 relative">
      <div className="max-w-4xl mx-auto">
        <motion.h4
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-[#0657E7] to-blue-400 bg-clip-text text-transparent"
        >
          Meet the Builder
        </motion.h4>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-gradient-to-br from-background/80 to-background/40 border border-border/50 rounded-3xl p-8 md:p-12 hover:border-[#0657E7]/30 hover:shadow-2xl hover:shadow-[#0657E7]/10 transition-all duration-500 group"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-[#0657E7] shadow-2xl shadow-[#0657E7]/20 relative z-10">
                <img
                  src="/cornerstone.png"
                  alt="Cornerstone Ephraim"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0657E7]/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h5 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-[#0657E7] bg-clip-text text-transparent">
                  Cornerstone Ephraim
                </h5>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#0657E7]/10 text-[#0657E7] rounded-full text-sm font-medium border border-[#0657E7]/20">
                    Frontend Engineer
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
                    Tech Enthusiast
                  </span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
                    Creative Thinker
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-muted-foreground text-lg leading-relaxed"
              >
                Passionate about revolutionizing education through AI, I built
                SummAid as part of my final year project at the University of
                Ilorin. My goal is to make learning more accessible, efficient,
                and engaging for students everywhere.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center md:justify-start gap-4"
              >
                <a
                  href="https://github.com/Cornerstone-04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-[#0657E7] border border-border hover:border-[#0657E7] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0657E7]/25"
                >
                  <FaGithub className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/cornerstoneephraim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-[#0657E7] border border-border hover:border-[#0657E7] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0657E7]/25"
                >
                  <FaLinkedin className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
                </a>
                <a
                  href="https://twitter.com/4th_ephraim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-[#0657E7] border border-border hover:border-[#0657E7] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0657E7]/25"
                >
                  <FaTwitter className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
                </a>
                <a
                  href="https://instagram.com/thecornerstoneephraim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-[#0657E7] border border-border hover:border-[#0657E7] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#0657E7]/25"
                >
                  <FaInstagram className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
                </a>
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-[#0657E7]/10 to-blue-400/10 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl opacity-50"></div>
        </motion.div>
      </div>
    </section>
  );
};
