import { FormTextareaType } from "../../types/form";
import { Controller } from "react-hook-form";

type Props = FormTextareaType;

export const FormTextArea = ({
  label,
  name,
  type,
  className,
  placeholder,
  onInput,
  onChange,
  required = false,
  register,
  value,
  defaultValue,
  disabled = false,
  control,
  error,
  cols,
  rows,
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
            <textarea
              {...field}
              className={`
                  block w-full rounded-lg
                  ${error ? "border-red-600" : "border-gray-300"} 
                  ${className}
                  ${disabled && "cursor-not-allowed bg-gray-100 text-gray-600"}
                `}
              placeholder={placeholder ?? ""}
              required={required}
              defaultValue={defaultValue}
              disabled={disabled}
              cols={cols ?? 2}
              rows={rows ?? 2}
            />
          )}
        />
      ) : (
        <textarea
          className={`
              block w-full rounded-lg
              ${error ? "border-red-600" : "border-gray-300"} 
              ${className}
              ${disabled && "cursor-not-allowed bg-gray-100 text-gray-600"}
            `}
          placeholder={placeholder ?? ""}
          required={required}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          cols={cols ?? 2}
          rows={rows ?? 2}
        />
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};
