import { NeoInput } from "./neo-input";
import { NeoTextarea } from "./neo-textarea";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "./neo-select";

interface FieldInfoProps {
  field: any;
}

export function FieldInfo({ field }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-[0.625rem] text-red-500 font-bold uppercase tracking-widest mt-1">
          {field.state.meta.errors.map((error: any, i: number) => {
            const message =
              typeof error === "string"
                ? error
                : error?.message || "Invalid field";
            return (
              <span key={i}>
                {message}
                {i < field.state.meta.errors.length - 1 ? ", " : ""}
              </span>
            );
          })}
        </p>
      ) : null}
    </>
  );
}

interface NeoFormFieldProps {
  form: any;
  name: string;
  validators?: any;
  label?: string;
  type?: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  className?: string;
  hideLabel?: boolean;
}

export function NeoFormField({
  form,
  name,
  validators,
  label,
  type = "text",
  placeholder,
  options,
  className,
  hideLabel = false,
}: NeoFormFieldProps) {
  const renderField = (field: any) => {
    if (type === "select") {
      return (
        <NeoSelect
          value={field.state.value}
          onValueChange={(val) => field.handleChange(val)}
        >
          <NeoSelectTrigger
            className={className || "w-full h-12 bg-background text-sm"}
          >
            <NeoSelectValue placeholder={placeholder} />
          </NeoSelectTrigger>
          <NeoSelectContent>
            {options?.map((opt) => (
              <NeoSelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs"
              >
                {opt.label}
              </NeoSelectItem>
            ))}
          </NeoSelectContent>
        </NeoSelect>
      );
    }

    const InputComponent = type === "textarea" ? NeoTextarea : NeoInput;
    const defaultClassName =
      type === "textarea"
        ? "focus-visible:border-primary focus-visible: font-semibold text-sm min-h-[150px] p-4"
        : "focus-visible:border-primary h-14 text-lg";

    return (
      <InputComponent
        type={type === "number" ? "number" : undefined}
        value={field.state.value || ""}
        onBlur={field.handleBlur}
        onChange={(e: any) =>
          field.handleChange(
            type === "number" ? Number(e.target.value) : e.target.value,
          )
        }
        placeholder={placeholder}
        className={className || defaultClassName}
      />
    );
  };

  return (
    <form.Field
      name={name}
      validators={validators}
      children={(field: any) => (
        <div className="w-full flex-1">
          {!hideLabel && label && (
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
              {label}
            </label>
          )}

          {renderField(field)}

          <FieldInfo field={field} />
        </div>
      )}
    />
  );
}
