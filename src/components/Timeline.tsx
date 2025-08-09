import { useEffect, useRef } from "react";
import type { FactShift, Shift } from "../types/types";
import { Timeline as VisTimeline } from "vis-timeline/standalone";
import { useTimelineData } from "../hooks/useTimelineData";
import "./Timeline.css";

interface TimelineProps {
    plan: Shift[];
    fact: FactShift[];
    startDate: Date | null;
    endDate: Date | null;
}

export default function Timeline({ plan, fact, startDate, endDate }: TimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const { groups, items } = useTimelineData(plan, fact, startDate, endDate);

    useEffect(() => {
        if (!timelineRef.current || !startDate || !endDate) return;
        const timeline = new VisTimeline(timelineRef.current, items, groups, {
            start: startDate,
            end: endDate,
            min: startDate,
            max: endDate,
            orientation: "top",
            stack: false,
            editable: false,
            showCurrentTime: false,
        });
        return () => timeline.destroy();
    }, [groups, items, startDate, endDate]);

    return (
        <div className="timeline-scope w-full overflow-auto border rounded-md">
            <div ref={timelineRef} className="timeline-scope" />
        </div>
    );
}
