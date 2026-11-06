import { type HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[#1e293b] border border-white/10 rounded-2xl p-6 ${
          hoverable
            ? "hover:border-sky-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
