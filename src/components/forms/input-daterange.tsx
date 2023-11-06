import { DateRangeFormType } from "../../types/form";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "./forms.css";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react";
import { dateFormatInput, dateOnlyFormat } from "../../helper/date";
import { Controller } from "react-hook-form";

type Props = DateRangeFormType;

export const DateRangeForm = ({
  label,
  name_start_at,
  name_end_at,
  required = false,
  value,
  defaultValueStartAt,
  defaultValueEndAt,
  control,
  disabled = false,
  error_start_at,
  error_end_at,
  onChangeStartAt,
  onChangeEndAt,
  maxDate,
  minDate,
}: Props) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultValueStartAt ? new Date(defaultValueStartAt) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultValueEndAt ? new Date(defaultValueEndAt) : undefined
  );

  const DateInput = forwardRef<
    HTMLButtonElement,
    { value: string; onClick: () => void }
  >(({ value, onClick }, ref) => (
    <button
      className="py-2 w-full text-left px-3 block text-gray-700"
      onClick={onClick}
      ref={ref}
    >
      {value === "" ? "Start Date" : dateOnlyFormat(value)}
    </button>
  ));

  const DateInput2 = forwardRef<
    HTMLButtonElement,
    { value: string; onClick: () => void }
  >(({ value, onClick }, ref) => (
    <button
      className="py-2 w-full text-left px-3 block text-gray-700"
      onClick={onClick}
      ref={ref}
    >
      {value === "" ? "End Date" : dateOnlyFormat(value)}
    </button>
  ));

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm mb-1 text-gray-700">
          {label}
          {required ? <span className="text-red-600">*</span> : ""}
        </label>
      )}
      {control ? (
        <div className="flex gap-3 w-full border border-gray-300 rounded-lg items-center">
          <Controller
            name={name_start_at}
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={startDate}
                onChange={(date: Date) => {
                  setStartDate(date);
                  field.onChange(date);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                customInput={<DateInput value="" onClick={() => {}} />}
                maxDate={maxDate}
              />
            )}
          />
          <div style={{ width: "5%" }}>
            <ArrowRight />
          </div>
          <Controller
            name={name_end_at}
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={endDate}
                onChange={(date: Date) => {
                  setEndDate(date);
                  field.onChange(date);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={maxDate}
                customInput={<DateInput2 value="" onClick={() => {}} />}
              />
            )}
          />
        </div>
      ) : (
        <div className="flex gap-3 w-full border border-gray-300 rounded-lg items-center">
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            customInput={<DateInput value="" onClick={() => {}} />}
          />
          <div style={{ width: "5%" }}>
            <ArrowRight />
          </div>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            customInput={<DateInput2 value="" onClick={() => {}} />}
          />
          <div
            style={{ width: "5%" }}
            className="flex items-center justify-end"
          >
            <CalendarBlank size={18} className="text-gray-700" />
          </div>
        </div>
      )}

      {error_start_at && (
        <small className="text-xs text-red-600">{error_start_at}</small>
      )}
      {error_end_at && (
        <small className="text-xs text-red-600">{error_end_at}</small>
      )}
    </div>
  );
};
