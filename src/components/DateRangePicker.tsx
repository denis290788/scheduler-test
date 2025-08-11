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
        <div className="mb-2 py-4 flex flex-col sm:flex-row gap-4 items-center">
            <div>
                <label className="mr-2 text-sm font-medium text-gray-700">Начало</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    locale="ru"
                    dateFormat="dd.MM.yyyy"
                    className="w-full h-8 px-2 rounded-md bg-gray-100 border-gray-300 shadow-sm sm:text-sm focus:outline-none"
                />
            </div>
            <div>
                <label className="mr-4 text-sm font-medium text-gray-700 sm:mr-2">Конец</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate ?? undefined}
                    locale="ru"
                    dateFormat="dd.MM.yyyy"
                    className="h-8 px-2 rounded-md bg-gray-100 border-gray-300 shadow-sm sm:text-sm focus:outline-none"
                />
            </div>
            <div className="w-65 sm:w-auto">
                <button
                    onClick={handleClick}
                    disabled={!startDate}
                    className={`py-1 px-4 rounded-md text-white font-medium transition-colors ${
                        startDate ? "bg-cyan-800 hover:bg-cyan-900" : "bg-gray-400"
                    } w-full`}
                >
                    Показать график
                </button>
            </div>
        </div>
    );
}
