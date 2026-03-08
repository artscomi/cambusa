"use client";

import { usePathname } from "next/navigation";
import { useHeaderScroll } from "./HeaderBar";
import { ApiCallCountComponent } from "./ApiCallCountComponent";
import { DropdownMenuComponent } from "./Dropdown";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

type HeaderNavContentProps = {
  userId: string | null;
  aiCallLeft: number;
  name: string | null;
};

export function HeaderNavContent({
  userId,
  aiCallLeft,
  name,
}: HeaderNavContentProps) {
  const { isTransparent } = useHeaderScroll();
  const pathname = usePathname();
  /** Testo bianco solo in home con header trasparente; nelle pagine interne sempre primary */
  const useLightText = pathname === "/" && isTransparent;

  const linkClass = useLightText
    ? "font-medium text-white hover:text-white/80 transition-colors"
    : "font-medium text-primary hover:text-primary-light transition-colors";

  const wrapperClass = useLightText ? "text-white" : "text-primary";

  return (
    <nav
      className={`w-full ${wrapperClass}`}
      aria-label="Navigazione principale"
    >
      <ul className="flex justify-end items-center gap-5 sm:gap-6 text-sm md:text-base w-full">
        <li>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
        </li>
        {userId ? (
          <>
            <ApiCallCountComponent aiCallLeft={aiCallLeft} />
            <li>
              <DropdownMenuComponent name={name ?? ""} />
            </li>
          </>
        ) : (
          <li>
            <div className={wrapperClass}>
              <SignInButton>Sign In</SignInButton>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}
