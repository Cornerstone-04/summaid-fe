import { Brain } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";


export const Footer = () => {
    return (
         <footer className="backdrop-blur-lg bg-muted/30 border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-[#0657E7] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">SummAid</span>
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="https://github.com/Cornerstone-04/summaid-fe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-5 h-5 hover:text-[#0657E7] transition" />
            </a>
            <a
              href="https://linkedin.com/in/cornerstoneephraim"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-5 h-5 hover:text-[#0657E7] transition" />
            </a>
            <a
              href="https://twitter.com/4th_ephraim"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-5 h-5 hover:text-[#0657E7] transition" />
            </a>
            <a
              href="https://instagram.com/thecornerstoneephraim"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-5 h-5 hover:text-[#0657E7] transition" />
            </a>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0">
            © {new Date().getFullYear()} Cornerstone E. | Built as part of my
            bachelor's degree project at the University of Ilorin.
          </div>
        </div>
      </footer>
    )
}