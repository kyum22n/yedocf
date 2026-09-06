import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";

const FadeTabs = ({ tabs, direction = "horizontal" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className={`flex ${direction === "vertical" ? "flex-col" : ""} gap-2`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              index === activeIndex ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 relative min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {tabs[activeIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

FadeTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
};

export default FadeTabs;
