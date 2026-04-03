type SubmitButtonProps = {
  label?: string;
};

export function SubmitButton({ label = "Отправить" }: SubmitButtonProps) {
  return <button type="submit">{label}</button>;
}
