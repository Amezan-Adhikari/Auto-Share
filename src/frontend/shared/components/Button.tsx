"use client"
interface Props {
  onclick?: () => void;
  variant: "primary" | "secondary";
  children?: React.ReactNode;
  className?: string;
}

export default function Button({
  onclick,
  variant = "primary",
  className,
  children,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (variant == "secondary") {
    return (
      <button
        className={`${className} cursor-pointer active:scale-[0.98]`}
        onClick={onclick}
        {...rest}
      >
        {children}
       
      </button>
    );
  }

  return (
    <button
      className={`${className} cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100 p-2 px-6 text-white disabled:opacity-45 bg-black relative overflow-hidden rounded-full group hover:bg-black/80 active:scale-[0.98]`}
      onClick={onclick}
      {...rest}
    >
      {children}
      <div className="h-full group-disabled:hidden absolute w-10 top-0 -left-10 group-hover:left-full transition-all duration-300 ease-in-out bg-white/15"></div>
    </button>
  );
}
