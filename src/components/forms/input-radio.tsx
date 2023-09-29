import { Controller } from "react-hook-form";
import { FormCheckboxType } from "../../types/form";
import { Label, Radio } from "flowbite-react";

type Props = FormCheckboxType;

export const FormInput = ({
  label,
  name,
  className,
  placeholder,
  required = false,
  control,
  error,
  display = "block",
  grid,
  options,
  onChange,
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
            <div className={`${display} ${display === "grid" && "gap-2"}`}>
              {options?.map((item: any, key) => (
                <div className="flex items-center gap-2">
                  <Radio
                    defaultChecked
                    id={`radio-option-${name}-${key}`}
                    name={name}
                    value={item.value}
                  />
                  <Label htmlFor={`radio-option-${name}-${key}`}>
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      ) : (
        // <input
        //   type={type ?? "text"}
        //   name={name} // Add name for uncontrolled inputs
        //   className={`block w-full rounded-lg border border-gray-300 p-2 ${
        //     error ? "border-red-600" : "border-gray-300"
        //   } ${className}`}
        //   placeholder={placeholder ?? ""}
        //   required={required}
        //   onChange={onChange}
        // />
        <></>
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};
