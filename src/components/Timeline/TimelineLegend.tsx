export default function TimelineLegend() {
    return (
        <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded border bg-[var(--plan-bg)] border-[var(--plan-border)]"></div>
                <span>Плановая смена</span>
            </div>
            <div className="flex items-center">
                <div
                    className="w-4 h-4 mr-2 rounded border border-[var(--fact-border)]"
                    style={{
                        background: `
                            var(--fact-pattern),
                            var(--fact-bg)
                        `,
                        backgroundSize: "15px 15px",
                    }}
                ></div>
                <span>Фактическая смена</span>
            </div>
            <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded border bg-[var(--absence-bg)] border-[var(--absence-border)]"></div>
                <span>Прогул</span>
            </div>
            <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded border bg-[var(--late-bg)] border-[var(--late-border)]"></div>
                <span>Опоздание</span>
            </div>
            <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded border bg-[var(--early-bg)] border-[var(--early-border)]"></div>
                <span>Ранний уход</span>
            </div>
        </div>
    );
}
