export default function Button({ children, className, ...rest }) {
  const defaultClassName =
    "text-white bg-gray-300 border-[3px] border-gray-600 p-3 rounded-2xl";
  return (
    <button
      type="button"
      className={`${className ? className : defaultClassName}`}
      {...rest}
    >
      {children}
    </button>
  );
}
