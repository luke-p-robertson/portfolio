import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { SmartLink } from "@/components/SmartLink/SmartLink";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href.trim() : "";
      if (!href) {
        return <>{children}</>;
      }
      return <SmartLink href={href}>{children}</SmartLink>;
    },
  },
};

type BlockContentProps = {
  value?: PortableTextBlock[] | null;
};

export function BlockContent({ value }: BlockContentProps) {
  if (!value?.length) {
    return null;
  }

  return <PortableText value={value} components={components} />;
}
