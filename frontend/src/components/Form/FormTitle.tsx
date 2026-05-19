import type { FormTitleProps } from "@/@types/form";

export default function FormTitle({ title, subtitle }: FormTitleProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="font-bold text-2xl md:text-3xl text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
      )}
    </div>
  );
}