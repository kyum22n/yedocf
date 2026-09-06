import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoToReservationButton = () => {
  const navigate = useNavigate();
  const [isNearFooter, setIsNearFooter] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearFooter(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // 푸터가 10% 보이면 트리거
      }
    );

    observer.observe(footer);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleClick = () => {
    navigate('/reservation');
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        isNearFooter ? 'absolute bottom-[56px]' : 'fixed bottom-14'
      } right-20 px-6 py-3 rounded-full bg-orange-200 text-black font-semibold shadow-lg hover:bg-orange-300 transition-all z-50`}
    >
      예약하기
    </button>
  );
};

export default GoToReservationButton;
