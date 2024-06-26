import { Control } from "react-hook-form";
import React, { ChangeEvent } from "react";
import { ActionMeta } from "react-select";

export type FormType = {
  autofocus?: boolean;
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  // error?: [] | null;
  error?: any;
  // error?: string | string[] | null | undefined;
  regex?: string;
  hint?: string | null;
};

export type FormDaterangeType = {
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  control?: Control<any>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: [] | null;
  hint?: string | null;
};

export type FormSelectType = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  defaultValue?: any;
  defaultInputValue?: any;
  value?: any;
  options?: any;
  optionLabel?: any;
  optionValue?: any;
  loadOption?: any;
  error?: [] | null;
  disabled?: boolean;
  control?: Control<any>;
  onChange?:
    | ((newValue: unknown, actionMeta: ActionMeta<unknown>) => void)
    | undefined;
  onChangeAsync?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string | null;
};

export type SelectOptionType = {
  label: string | number;
  value: string | number;
};

export type EnumOptionType = {
  key: string;
  name: string;
};

export type SelectOption2Type = {
  id: string | number;
  name: string;
};

export type FormSelectTypeSetting = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  defaultValue?: any;
  defaultInputValue?: any;
  value?: any;
  options?: any;
  optionLabel?: any;
  optionValue?: any;
  loadOption?: any;
  error?: [] | null;
  disabled?: boolean;
  control?: Control<any>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAsync: (e: any) => void;
  hint?: string | null;
};

export type FormInputTooltipType = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: [] | null;
  tooltip?: string;
  id?: string;
  describeInput?: string;
  hint?: string | null;
};

export type FormTextareaType = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  cols?: number;
  rows?: number;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement> | undefined
  ) => void;
  error?: [] | null;
  hint?: string | null;
};

export type DatePickType = {
  start_date: boolean;
  end_date: boolean;
};
export type FormUploadType = {
  label: string;
  name: string;
  className?: string;
  defaultValue?: any;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  isMultiple?: boolean;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLPictureElement> | undefined) => void;
  error?: [] | null;
  withDownload?: boolean;
  hint?: string | null;
};

export type DateRangeFormType = {
  label: string;
  name_start_at: string;
  name_end_at: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValueStartAt?: any;
  defaultValueEndAt?: any;
  icon?: string | JSX.Element;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStartAt?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEndAt?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error_start_at?: [] | null;
  error_end_at?: [] | null;
  withNote?: boolean;
  hint?: string | null;
  maxDate?: Date;
  minDate?: Date;
};

export type FormSwitchType = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: [] | null;
  options?: string[];
  size?: "sm" | "md" | "lg";
  ref?: any;
  hint?: string | null;
};

export type FormCheckboxType = {
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  register?: any;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  checked?: boolean;
  options?: any[];
  control?: Control<any>;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: [] | null;
  display?: "inline" | "block" | "grid" | "flex";
  grid?: number;
  hint?: string | null;
};
