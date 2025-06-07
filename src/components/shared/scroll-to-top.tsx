import { FaArrowUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const ScrollToTOp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-sa-primary text-white rounded-full shadow-lg hover:bg-sa-primary/90 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sa-primary focus:ring-offset-2 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <FaArrowUp className="w-6 h-6" />
    </Button>
  );
};
