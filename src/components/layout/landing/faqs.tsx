import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const FAQS = () => {
  const faqs = [
    {
      value: "q1",
      question: "What makes SummAid different from other study tools?",
      answer:
        "SummAid leverages advanced AI to transform your study materials into multiple learning formats. Unlike basic summary tools, it creates intelligent summaries, adaptive flashcards, and audio study guides tailored to your content. It's designed specifically for students who want to maximize their study efficiency and retention.",
    },
    {
      value: "q2",
      question: "Is SummAid really free to use?",
      answer:
        "Yes, SummAid is completely free as part of my final year project at the University of Ilorin. You get access to all AI-powered features including summaries, flashcard generation, and audio recaps without any subscription fees or hidden costs.",
    },
    {
      value: "q3",
      question: "What file formats does SummAid support?",
      answer:
        "SummAid supports a wide range of file formats including PDFs, DOCX files, images (JPG, PNG), and text documents. Whether you have lecture slides, scanned notes, or typed documents, SummAid can extract and analyze the content effectively.",
    },
    {
      value: "q4",
      question: "How accurate are the AI-generated summaries?",
      answer:
        "SummAid uses state-of-the-art AI models to ensure high accuracy in content extraction and summarization. The system is designed to capture key concepts, maintain context, and present information in a clear, structured format that enhances understanding and retention.",
    },
    {
      value: "q5",
      question: "Can I customize my study materials and flashcards?",
      answer:
        "Absolutely. SummAid allows you to edit and customize generated summaries, modify flashcard content, and adjust the complexity level of your study materials. This ensures that the content aligns perfectly with your learning style and academic requirements.",
    },
  ];
  return (
    <section className="px-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <h4 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#0657E7] to-blue-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h4>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={faq.value}
                className="backdrop-blur-xl bg-gradient-to-r from-background/80 to-background/40 border border-border/50 rounded-2xl px-6 py-2 hover:border-[#0657E7]/30 hover:shadow-lg hover:shadow-[#0657E7]/10 transition-all duration-300 group data-[state=open]:border-[#0657E7]/50 data-[state=open]:shadow-xl data-[state=open]:shadow-[#0657E7]/20"
              >
                <AccordionTrigger className="cursor-pointer text-left hover:no-underline py-6 text-base font-medium group-hover:text-[#0657E7] transition-colors duration-200 [&[data-state=open]]:text-[#0657E7] flex justify-between w-full">
                  <span className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0657E7]/40 group-hover:bg-[#0657E7] group-data-[state=open]:bg-[#0657E7] transition-colors duration-200"></div>
                    {faq.question}
                  </span>
                  <ChevronDown className="transition-all duration-400 group-data-[state=open]:rotate-180" />
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="pl-5 border-l-2 border-[#0657E7]/20">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
