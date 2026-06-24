let chart;

export function draw(canvas, series, forecast) {

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "River",
                    data: series.map(p => ({
                        x: new Date(p.time),
                        y: p.level
                    })),
                    borderColor: "#1565c0",
                    pointRadius: 0
                },
                {
                    label: "Forecast",
                    data: [
                        { x: new Date(), y: forecast.current },
                        { x: Date.now()+3600000, y: forecast.plus1 },
                        { x: Date.now()+10800000, y: forecast.plus3 },
                        { x: Date.now()+21600000, y: forecast.plus6 }
                    ],
                    borderColor: "#ff9800",
                    borderDash: [5,5],
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
