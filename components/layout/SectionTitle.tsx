import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h1>{children}</h1>;
}
