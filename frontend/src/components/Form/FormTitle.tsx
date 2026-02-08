import type { FormTitleProps } from "@/@types/form";

export default function FormTitle({ title }: FormTitleProps) {
  return (
    <h2 className="font-bold text-2xl text-center my-10">{title}</h2>
  )
}