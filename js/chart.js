let chart;

export function draw(canvas, data) {

    if (!canvas) return;

    if (!data.series) return;

    if (chart) {
        chart.destroy();
    }

    const river = data.series.map(p => ({
        x: new Date(p.time),
        y: p.level
    }));

    const now = new Date();

    const forecast = [

        {
            x: now,
            y: data.estimatedLevel
        },

        {
            x: new Date(
                now.getTime() + 3600000
            ),
            y: data.forecast["1h"].level
        },

        {
            x: new Date(
                now.getTime() + 10800000
            ),
            y: data.forecast["3h"].level
        },

        {
            x: new Date(
                now.getTime() + 21600000
            ),
            y: data.forecast["6h"].level
        }
    ];

    chart = new Chart(canvas, {

        type: "line",

        data: {

            datasets: [

                {
                    label: "River",

                    data: river,

                    borderColor: "#1565c0",

                    borderWidth: 2,

                    pointRadius: 3,

                    tension: 0.3
                },

                {
                    label: "Forecast",

                    data: forecast,

                    borderColor: "#ff9800",

                    borderDash: [5,5],

                    borderWidth: 2,

                    pointRadius: 3,

                    tension: 0.3
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                x: {
                    type: "time"
                },

                y: {
                    title: {
                        display: true,
                        text: "Level (m)"
                    }
                }
            }
        }
    });
}
