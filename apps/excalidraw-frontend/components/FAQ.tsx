"use client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const faqData = [
  {
    question: "What is Slapdash?",
    answer:
      "Slapdash is a fast, lightweight, and collaborative whiteboard tool designed for creating hand-drawn-style diagrams, flowcharts, and sketches effortlessly.",
  },
  {
    question: "Can I use Slapdash offline?",
    answer:
      "Yes, Slapdash supports offline mode, allowing you to work without an internet connection and sync changes when you're back online.",
  },
  {
    question: "Does Slapdash support real-time collaboration?",
    answer:
      "Yes, you can invite others via a shareable link and collaborate on drawings in real time.",
  },
  {
    question: "Can I export my drawings in different formats?",
    answer:
      "Absolutely! You can export your work as PNG, SVG, and JSON to use in other applications or continue editing later.",
  },
  {
    question: "Can I create and reuse custom elements?",
    answer:
      "Yes, Slapdash allows you to save custom shapes, templates, and elements to speed up your workflow.",
  },
];

export const FAQS = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="flex justify-center">
        <span className="max-w-sm mx-auto tracking-tight text-[#65e6bf] px-2 py-1 rounded-full text-xs bg-[#65e6bf]/20">
          FAQ
        </span>
      </div>
      <h2 className="mt-3 text-3xl md:text-4xl text-center max-w-xs mx-auto tracking-tight text-white font-primary font-medium">
        Frequently Asked Questions
      </h2>

      <div className="mt-5 flex flex-col items-center gap-3">
        {faqData.map((faq, index) => (
          <AnimatePresence key={index}>
            <motion.div
              className="bg-[#65e6bf]/10 rounded-lg w-[80vw] md:w-[40vw] overflow-hidden"
              initial={{ scaleY: 0.95, opacity: 0.8 }}
              animate={{
                scaleY: openIndex === index ? 1.06 : 1,
                opacity: 1,
              }}
              exit={{ scaleY: 0.95, opacity: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500, 
                damping: 14, 
                bounce: 0.75, 
                duration: 0.2, 
              }}
              style={{ originY: 0 }}
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="h-12 cursor-pointer flex justify-between items-center rounded-lg px-4 py-2"
              >
                <h3 className="text-white tracking-tight">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 20 }}
                >
                  <PlusIcon className="text-white" />
                </motion.div>
              </div>

              {openIndex === index && (
                <motion.div
                  initial={{ scaleY: 0.9, opacity: 0 }}
                  animate={{
         
                    opacity: 1,
                  }}
                  exit={{ scaleY: 0.95, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 12,
                    bounce: 0.8,
                    duration: 0.3, // Snappier feel
                  }}
                  style={{ originY: 0 }}
                  className="text-white tracking-tight p-4 text-xs md:text-sm"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </section>
  );
};
