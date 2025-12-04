function PrimaryButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;


