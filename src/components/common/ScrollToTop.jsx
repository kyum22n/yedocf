//ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 전환 시 스크롤 최상단으로 이동
    window.scrollTo({ top: 0, behavior: 'instant' }); // 부드럽게 하고 싶다면 'smooth'
  }, [pathname]);

  return null;
};

export default ScrollToTop;