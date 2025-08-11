import { useState } from "react";
import DateRangePicker from "./components/DateRangePicker";
import planData from "./data/plan.json";
import factData from "./data/fact.json";
import type { FactShift, Shift } from "./types/types";
import "./components/Timeline/Timeline.styles.css";
import Timeline, { TimelineLegend } from "./components/Timeline";

export default function App() {
    const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">График работы сотрудников</h1>
            <DateRangePicker
                plan={planData as Shift[]}
                onShowTimeline={(start, end) => setRange({ start, end })}
            />
            {range && (
                <div className="timeline-scope">
                    <TimelineLegend />
                    <Timeline
                        plan={planData as Shift[]}
                        fact={factData as FactShift[]}
                        startDate={range.start}
                        endDate={range.end}
                    />
                </div>
            )}
        </div>
    );
}
