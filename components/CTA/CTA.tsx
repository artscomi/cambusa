"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";
import { ctaVariants, type CTAVariant } from "./cta-variants";

type CTABase = {
  variant?: CTAVariant;
  full?: boolean;
  center?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Su link, con `disabled` si mostra uno span non cliccabile. */
  disabled?: boolean;
};

export type CTAProps =
  | (CTABase & {
      href: string;
    } & Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof CTABase | "href"
      >)
  | (CTABase &
      Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        keyof CTABase
      > & { href?: undefined });

function isNativeAnchorHref(href: string) {
  return (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export const CTA = forwardRef<HTMLButtonElement, CTAProps>(function CTA(
  props,
  ref
) {
  if ("href" in props && props.href) {
    const {
      variant = "solid",
      full,
      center,
      className,
      children,
      disabled,
      href,
      ...anchorRest
    } = props;

    const classes = cn(
      ctaVariants({ variant }),
      full && "w-full",
      center && "mx-auto",
      className
    );

    if (disabled) {
      return (
        <span
          className={cn(classes, "cursor-not-allowed opacity-50")}
          aria-disabled="true"
        >
          {children}
        </span>
      );
    }

    if (isNativeAnchorHref(href)) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const btnProps = props as CTABase &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CTABase> & {
      href?: undefined;
    };

  const {
    variant = "solid",
    full,
    center,
    className,
    children,
    disabled,
    type = "button",
    ...buttonRest
  } = btnProps;

  const classes = cn(
    ctaVariants({ variant }),
    full && "w-full",
    center && "mx-auto",
    className
  );

  const buttonType =
    type === "submit" || type === "reset" ? type : "button";

  return (
    <button
      ref={ref}
      type={buttonType}
      disabled={disabled}
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
});
