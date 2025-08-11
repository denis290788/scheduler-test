import { DataSet } from "vis-data";
import type { FactShift, Shift } from "../../types/types";
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

        //Плановые смены
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

        //Фактические смены
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

        plan.forEach((shift, i) => {
            const planStart = new Date(shift.planStart);
            const planEnd = new Date(shift.planEnd);

            if (planEnd > new Date()) return;
            if (planStart < startDate || planEnd > endDate) return;

            const factShift = fact.find(
                (f) =>
                    f.employee === shift.employee &&
                    f.store === shift.store &&
                    new Date(f.factStart).toISOString().slice(0, 10) ===
                        planStart.toISOString().slice(0, 10)
            );

            //Прогулы
            if (!factShift) {
                items.push({
                    id: `absence-${i}`,
                    group: shift.employee,
                    start: planStart,
                    end: planEnd,
                    content: `${shift.role} (${shift.store})`,
                    title: `Плановая смена: ${getDuration(planStart, planEnd)}`,
                    className: "absence-shift",
                    type: "range",
                });
                return;
            }

            const factStart = new Date(factShift.factStart);
            const factEnd = new Date(factShift.factEnd);

            //Опоздания
            if (factStart > planStart && factStart <= planEnd) {
                items.push({
                    id: `late-${i}`,
                    group: shift.employee,
                    start: planStart,
                    end: factStart,
                    content: `Опоздание (${shift.store})`,
                    className: "late-shift",
                    type: "range",
                });
            }

            //Ранние уходы
            if (factEnd < planEnd && factEnd >= planStart) {
                items.push({
                    id: `early-${i}`,
                    group: shift.employee,
                    start: factEnd,
                    end: planEnd,
                    content: `Ранний уход (${shift.store})`,
                    className: "early-shift",
                    type: "range",
                });
            }
        });

        return { groups, items: new DataSet<DataItem>(items) };
    }, [plan, fact, startDate, endDate]);
}
