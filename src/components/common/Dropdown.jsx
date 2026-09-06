import { useState, useRef, useEffect } from "react";
import classNames from "classnames";

const Dropdown = ({
  options = [],
  onSelect,
  onChange,
  value,
  name,
  id,
  placeholder = "항목을 선택하세요",
  forcePlaceholder = false,
  className = "",
  disabled = false,
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // value 변화 감지
  useEffect(() => {
    if (value !== undefined && Array.isArray(options)) {
      const match = options.find((opt) => opt.value === value);
      setSelected(match || null);
    }
  }, [value, options]);

  // 배열 아니면 경고
  useEffect(() => {
    if (!Array.isArray(options)) {
      console.warn("[Dropdown 경고] options prop이 배열이 아닙니다. 현재 값:", options);
    }
  }, [options]);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.({ target: { name, value: option.value } });

    if(typeof onChange === "function"){
      onChange({target: { name, value: option.value}});
    }

    setIsOpen(false);
  };

  return (
    <div
      className={classNames("relative", className)}
      ref={dropdownRef}
    >
      <button
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={classNames(
          "w-full border rounded-md bg-white px-4 py-2 text-left shadow-sm flex justify-between items-center",
          disabled
            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "hover:border-black border-gray-300 text-black",
          error && "border-red-500"
        )}
      >
        <span className="overflow-clip whitespace-nowrap text-ellipsis">
          {forcePlaceholder
            ? placeholder
            : selected?.label || placeholder}
        </span>
        <svg
          className={classNames(
            "w-4 h-4 ml-2 text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && Array.isArray(options) && (
        <ul
          className="absolute z-10 mt-1 w-full max-h-48 border border-gray-300 rounded-md bg-white shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded"
        >
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option)}
              className={classNames(
                "px-4 py-2 hover:bg-gray-100 cursor-pointer",
                selected?.value === option.value && "bg-gray-200 font-semibold"
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
