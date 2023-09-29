import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FormSelectType } from "../../types/form";
import { Controller } from "react-hook-form";
import { StylesConfig } from "react-select";

type Props = FormSelectType;

export const selectStyle: StylesConfig = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    padding: "2px",
    border: "solid #D1D5DB 1px",
  }),
  menuPortal: (provided) => ({
    ...provided,
    border: "solid #D1D5DB 1px",
    zIndex: 9999,
  }),
  menu: (provided) => ({
    ...provided,
    border: "solid #D1D5DB 1px",
    zIndex: 9999,
  }),
};

export const FormSelect = ({
  label,
  name,
  placeholder,
  required = false,
  options,
  defaultValue,
  control,
  multiple,
  optionLabel,
  optionValue,
  value,
  error,
  disabled,
  onChange,
}: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block mb-1 text-sm text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : ""}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select
              {...field}
              styles={selectStyle}
              required={required}
              placeholder={placeholder}
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              getOptionLabel={
                optionLabel ? optionLabel : (option: any) => option.label
              }
              getOptionValue={
                optionValue ? optionValue : (option: any) => option.value
              }
              options={options}
              isMulti={multiple}
              isDisabled={disabled}
            />
          )}
        />
      ) : (
        <Select
          styles={selectStyle}
          required={required}
          placeholder={placeholder}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          getOptionLabel={
            optionLabel ? optionLabel : (option: any) => option.label
          }
          getOptionValue={
            optionValue ? optionValue : (option: any) => option.value
          }
          options={options}
          isMulti={multiple}
          isDisabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

export const FormSelectCustom = ({
  label,
  name,
  placeholder,
  required = false,
  options,
  defaultValue,
  control,
  multiple,
  optionLabel,
  optionValue,
  value,
  error,
  disabled,
  onChange,
}: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block mb-1 text-sm text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : ""}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select
              {...field}
              styles={selectStyle}
              required={required}
              placeholder={placeholder}
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              getOptionLabel={
                optionLabel ? optionLabel : (option: any) => option.label
              }
              getOptionValue={
                optionValue ? optionValue : (option: any) => option.value
              }
              options={options}
              isMulti={multiple}
              isDisabled={disabled}
              onChange={onChange}
            />
          )}
        />
      ) : (
        <Select
          styles={selectStyle}
          required={required}
          placeholder={placeholder}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          getOptionLabel={
            optionLabel ? optionLabel : (option: any) => option.label
          }
          getOptionValue={
            optionValue ? optionValue : (option: any) => option.value
          }
          options={options}
          isMulti={multiple}
          isDisabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

export const FormSelectAsync = ({
  label,
  name,
  placeholder,
  required = false,
  loadOption,
  defaultValue,
  defaultInputValue,
  value,
  control,
  multiple,
  optionLabel,
  optionValue,
  disabled,
  error,
  onChange,
}: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block mb-1 text-sm text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : ""}
      </label>
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              cacheOptions
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              styles={selectStyle}
              required={required}
              defaultInputValue={defaultInputValue}
              loadOptions={loadOption}
              getOptionLabel={
                optionLabel ? optionLabel : (option: any) => option.label
              }
              getOptionValue={
                optionValue ? optionValue : (option: any) => option.value
              }
              placeholder={placeholder}
              defaultOptions={true}
              isMulti={multiple}
              // value={value}
              isDisabled={disabled}
            />
          )}
        />
      ) : (
        <AsyncSelect
          cacheOptions
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          styles={selectStyle}
          required={required}
          defaultInputValue={defaultInputValue}
          loadOptions={loadOption}
          getOptionLabel={
            optionLabel ? optionLabel : (option: any) => option.label
          }
          getOptionValue={
            optionValue ? optionValue : (option: any) => option.value
          }
          placeholder={placeholder}
          defaultOptions={true}
          isMulti={multiple}
          // value={value}
          isDisabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};

export const FormSelectAsyncCustom = ({
  label,
  name,
  placeholder,
  required = false,
  loadOption,
  defaultValue,
  control,
  multiple,
  optionLabel,
  optionValue,
  onChangeAsync,
  error,
}: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block mb-1 text-sm text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : ""}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <AsyncSelect
            cacheOptions
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            styles={selectStyle}
            required={required}
            defaultValue={defaultValue}
            loadOptions={loadOption}
            getOptionLabel={
              optionLabel ? optionLabel : (option: any) => option.label
            }
            getOptionValue={
              optionValue ? optionValue : (option: any) => option.value
            }
            placeholder={placeholder}
            defaultOptions={true}
            isMulti={multiple}
            onChange={(value) => {
              onChange(value);
            }}
          />
        )}
      />
      {error && <small className="text-xs text-red-600">{error}</small>}
    </div>
  );
};
