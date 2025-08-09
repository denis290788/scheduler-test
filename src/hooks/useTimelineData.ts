import { DataSet } from "vis-data";
import type { FactShift, Shift } from "../types/types";
import type { DataGroup, DataItem } from "vis-timeline";
import { useMemo } from "react";

function getDuration(start: Date, end: Date) {
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ч ${minutes} мин`;
}

export function useTimelineData(
    plan: Shift[],
    fact: FactShift[],
    startDate: Date | null,
    endDate: Date | null
) {
    return useMemo(() => {
        if (!startDate || !endDate) {
            return { groups: new DataSet<DataGroup>([]), items: new DataSet<DataItem>([]) };
        }

        const employees = Array.from(
            new Set([...plan.map((p) => p.employee), ...fact.map((f) => f.employee)])
        );

        const groups = new DataSet<DataGroup>(
            employees.map((employee) => ({ id: employee, content: employee }))
        );

        const items: DataItem[] = [];

        plan.forEach((shift, i) => {
            const start = new Date(shift.planStart);
            const end = new Date(shift.planEnd);
            if (start >= startDate && end <= endDate) {
                items.push({
                    id: `plan-${i}`,
                    group: shift.employee,
                    start,
                    end,
                    content: `${shift.role} (${shift.store})`,
                    title: `Плановая смена: ${getDuration(start, end)}`,
                    className: "plan-shift",
                    type: "range",
                });
            }
        });

        fact.forEach((shift, i) => {
            const start = new Date(shift.factStart);
            const end = new Date(shift.factEnd);

            const planShift = plan.find(
                (p) =>
                    p.employee === shift.employee &&
                    p.store === shift.store &&
                    new Date(p.planStart).toISOString().slice(0, 10) ===
                        start.toISOString().slice(0, 10)
            );

            const planStart = planShift ? new Date(planShift.planStart) : start;
            const planEnd = planShift ? new Date(planShift.planEnd) : end;

            if (start >= startDate && end <= endDate) {
                items.push({
                    id: `fact-${i}`,
                    group: shift.employee,
                    start,
                    end,
                    content: `${shift.role} (${shift.store})`,
                    title: `Плановая смена: ${getDuration(planStart, planEnd)}`,
                    className: "fact-shift",
                    type: "range",
                });
            }
        });

        return { groups, items: new DataSet<DataItem>(items) };
    }, [plan, fact, startDate, endDate]);
}
