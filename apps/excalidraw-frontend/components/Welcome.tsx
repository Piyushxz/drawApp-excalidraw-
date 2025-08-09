"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useMeasure from "react-use-measure";

export default function MultiStepComponent({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="mb-2 font-semibold">This is step one</h2>
            <p>
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 256 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 192 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 384 }} />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="mb-2 font-semibold">This is step two</h2>
            <p>
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 256 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 192 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 384 }} />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="mb-2 font-semibold">This is step three</h2>
            <p>
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 256 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 192 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 128 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 224 }} />
              <div className="h-4 rounded-md bg-gray-200 animate-pulse" style={{ width: 384 }} />
            </div>
          </>
        );
    }
  }, [currentStep]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
        <motion.div
          animate={{ height: bounds.height }}
          className="relative mx-auto w-[550px] overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="p-6" ref={ref}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ x: "110%", opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ x: "-110%", opacity: 0 }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
            <motion.div layout className="mt-8 flex justify-between">
              <button
                className="h-8 w-20 rounded-full text-sm font-medium text-gray-600 border border-gray-200 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentStep === 0}
                onClick={() => {
                  if (currentStep === 0) {
                    return;
                  }
                  setCurrentStep((prev) => prev - 1);
                }}
              >
                Back
              </button>
              <button
                className="h-8 w-30 rounded-full text-sm font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg border border-blue-500 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentStep === 2}
                onClick={() => {
                  if (currentStep === 2) {
                    setCurrentStep(0);
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
              >
                Continue
              </button>
            </motion.div>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}