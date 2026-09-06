// ScrollToTopOnTabChange.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnTabChange = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.search]);

  return null;
};

export default ScrollToTopOnTabChange;
