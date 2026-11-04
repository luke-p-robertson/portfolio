import Link from "next/link";
import type { ComponentProps } from "react";

type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

/** `next/link` for site paths; a plain anchor (new tab for http) for everything else. */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const isWeb = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      href={href}
      {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
