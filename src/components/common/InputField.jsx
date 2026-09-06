import classNames from "classnames";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  variant = "user",
  labelHidden = true,
  className = "",
  autoComplete = "off",
  required = false,
  minLength,
  error,
}) => {
  const baseClass = "w-full focus:outline-none placeholder-gray-400";
  const styleByVariant = {
    user: "border-0 border-b-2 border-gray-400 focus:border-black bg-transparent pl-2",
    admin: "border border-gray-300 rounded-md focus:border-blue-500 bg-white pl-2",
  };
  const inputClass = classNames(baseClass, styleByVariant[variant], className, {
    "border-red-500": error,
  });

  return (
    <div className={classNames("relative", className)}>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
      />
      {label && !labelHidden && (
        <label
          htmlFor={name}
          className={classNames("text-sm text-gray-500", {
            "absolute left-0 -top-5": variant === "user",
            "block mb-1": variant === "admin",
          })}
        >
          {label}
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};



export default InputField;
