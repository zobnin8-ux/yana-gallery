import type { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField(props: TextareaFieldProps) {
  return <textarea {...props} />;
}
