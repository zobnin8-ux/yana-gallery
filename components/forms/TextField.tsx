import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export function TextField(props: TextFieldProps) {
  return <input {...props} />;
}
