import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale/ru";
import type { Shift } from "../types/types";

registerLocale("ru", ru);

interface DateRangePickerProps {
    plan: Shift[];
    onShowTimeline: (start: Date, end: Date) => void;
}

export default function DateRangePicker({ plan, onShowTimeline }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const getEndDate = (): Date => {
        if (endDate) return endDate;

        const latestPlanDate = plan.reduce((latest, shift) => {
            const shiftEnd = new Date(shift.planEnd);
            return shiftEnd > latest ? shiftEnd : latest;
        }, startDate || new Date());

        return latestPlanDate;
    };

    const handleClick = () => {
        if (startDate) {
            onShowTimeline(startDate, getEndDate());
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Начало</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    locale="ru"
                    dateFormat="dd.MM.yyyy"
                    showIcon
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Конец</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate ?? undefined}
                    locale="ru"
                    dateFormat="dd.MM.yyyy"
                    showIcon
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
            </div>
            <div className="flex items-end">
                <button
                    onClick={handleClick}
                    disabled={!startDate}
                    className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                        startDate ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
                    }`}
                >
                    Показать график
                </button>
            </div>
        </div>
    );
}
