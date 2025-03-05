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

      <div className="mt-5 flex flex-col items-center gap-2">
        {faqData.map((faq, index) => (
          <motion.div key={index} className="bg-[#65e6bf]/10 rounded-lg w-[80vw] md:w-[40vw]">
            <div
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="h-12 cursor-pointer flex justify-between items-center rounded-lg px-4"
            >
              <h3 className="text-white tracking-tight">{faq.question}</h3>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <PlusIcon className="text-white" />
              </motion.div>
            </div>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "80px", opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ type: "spring", stiffness: 200, bounce: 0.25, mass: 0.5 }}
                  className="text-white tracking-tight p-4 text-xs md:text-sm"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
