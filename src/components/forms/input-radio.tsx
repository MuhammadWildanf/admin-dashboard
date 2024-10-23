import { Controller } from "react-hook-form";
import { FormCheckboxType } from "../../types/form";
import { Label, Radio } from "flowbite-react";

type Props = FormCheckboxType;

export const FormInputRadio = ({
  label,
  name,
  className,
  placeholder,
  required = false,
  control,
  error,
  display = "block",
  options,
}: Props) => {
  return (
    <div className="mb-3">
      <label className="block text-sm mb-1 text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : ""}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div
              className={`${display} py-2 ${display === "grid" && "gap-2"} ${display === "flex" && "gap-3"
                }`}
            >
              {options?.map((item: any, key) => (
                <div key={key} className="flex items-center gap-2">
                  <Radio
                    {...field}
                    id={`radio-option-${name}-${key}`}
                    name={name}
                    value={item.value}
                    checked={field.value === item.value} // Use checked instead of defaultChecked
                    onChange={() => field.onChange(item.value)} // Set the value on change
                  />
                  <Label htmlFor={`radio-option-${name}-${key}`}>
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      ) : null}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};
