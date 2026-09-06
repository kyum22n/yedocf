// components/common/Button.jsx
import React from 'react';
import classNames from 'classnames';

const VARIANT_STYLES = {
  primary: 'bg-black text-white border border-black hover:bg-gray-800',
  secondary: 'bg-white text-black border border-black hover:bg-gray-100',
  danger: 'bg-red-500 text-white border border-red-500 hover:bg-red-600',
  success: 'bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600',
};

const SIZE_STYLES = {
  sm: 'text-sm h-8 px-3',
  md: 'text-base h-10 px-4',
  lg: 'text-lg h-12 px-5',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...rest
}) => {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeClass = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'rounded transition font-medium overflow-clip whitespace-nowrap',
        variantClass,
        sizeClass,
        className,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
