import { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { FormType } from "../../types/form";

type Props = FormType;

export const FormInput = ({
  label,
  name,
  type,
  className,
  placeholder,
  required = false,
  control,
  error,
  onChange,
  defaultValue,
  value,
  disabled,
  hint,
}: Props) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div className="relative">
              <i className="fa fa-user absolute text-primarycolor text-xl left-2 top-2"></i>
              <input
                {...field}
                type={type ?? "text"}
                className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 ${
                  error ? "border-red-600" : "border-gray-300"
                } ${className} ${disabled ? "bg-gray-100 text-gray-600" : ""}`}
                placeholder={placeholder ?? ""}
                required={required}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
              />
            </div>
          )}
        />
      ) : (
        <div className="mb-4">
          <i className="fa fa-user absolute text-primarycolor text-xl left-2 top-2"></i>
          <input
            type={type ?? "text"}
            name={name}
            className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 ${
              error ? "border-red-600" : "border-gray-300"
            } ${className} ${disabled ? "bg-gray-100 text-gray-600" : ""}`}
            placeholder={placeholder ?? ""}
            required={required}
            onChange={onChange}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
          />
        </div>
      )}
      {hint && <small className="text-xs text-gray-600">{hint}</small>}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

export const FormInputPassword = ({
  label,
  name,
  className,
  placeholder,
  register,
  onInput,
  onChange,
  required,
  defaultValue,
  control,
  onKeyPress,
  error,
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block mb-1 text-sm text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className="relative">
              <i className="fa fa-lock absolute text-primarycolor text-xl left-2 top-2"></i>
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                name={name}
                onInput={onInput}
                id={label}
                className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 pr-8 ${
                  error ? "border-red-600" : "border-gray-300"
                } ${className}`}
                placeholder={placeholder ?? ""}
                required={required}
                defaultValue={defaultValue}
                onKeyPress={onKeyPress}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span
                  className="text-gray-700 text-xl cursor-pointer hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="mb-4">
          <i className="fa fa-lock absolute text-primarycolor text-xl left-2 top-2"></i>
          <input
            {...(register ? { ...register(name) } : null)}
            type={showPassword ? "text" : "password"}
            name={name}
            onInput={onInput}
            id={label}
            className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 pr-8 ${
              error ? "border-red-600" : "border-gray-300"
            } ${className}`}
            placeholder={placeholder ?? ""}
            required={required}
            defaultValue={defaultValue}
            onKeyPress={onKeyPress}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span
              className="text-gray-700 text-xl cursor-pointer hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeSlash />}
            </span>
          </div>
        </div>
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

export const FormInputCurrency = ({
  label,
  name,
  className,
  placeholder,
  required = false,
  control,
  error,
  onChange,
  defaultValue,
  value,
  disabled,
  hint,
}: Props) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div className="relative">
              <i className="fa fa-dollar-sign absolute text-primarycolor text-xl left-2 top-2"></i>
              <input
                {...field}
                type="text"
                className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 ${
                  error ? "border-red-600" : "border-gray-300"
                } ${className} ${disabled ? "bg-gray-100 text-gray-600" : ""}`}
                placeholder={placeholder ?? ""}
                required={required}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                value={value}
              />
            </div>
          )}
        />
      ) : (
        <div className="mb-4">
          <i className="fa fa-dollar-sign absolute text-primarycolor text-xl left-2 top-2"></i>
          <input
            type="text"
            name={name}
            className={`block w-full rounded-lg border-b-2 border-gray-300 p-2 pl-8 ${
              error ? "border-red-600" : "border-gray-300"
            } ${className} ${disabled ? "bg-gray-100 text-gray-600" : ""}`}
            placeholder={placeholder ?? ""}
            required={required}
            onChange={onChange}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
          />
        </div>
      )}
      {hint && <small className="text-xs text-gray-600">{hint}</small>}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

