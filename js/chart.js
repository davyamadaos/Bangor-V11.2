let riverChart = null;

export function createChart(
    canvas,
    history,
    forecast
) {

    if (riverChart) {
        riverChart.destroy();
    }

    const historyData =
        history.map(point => ({
            x: new Date(point.time),
            y: point.level
        }));

    const forecastData = [

        {
            x: new Date(),
            y: forecast.estimatedLevel
        },

        {
            x: new Date(
                Date.now()
                + 3600000
            ),
            y: forecast.plus1
        },

        {
            x: new Date(
                Date.now()
                + 10800000
            ),
            y: forecast.plus3
        },

        {
            x: new Date(
                Date.now()
                + 21600000
            ),
            y: forecast.plus6
        }

    ];

    riverChart =
        new Chart(canvas, {

        type: "line",

        data: {

            datasets: [

                {
                    label:
                        "River Level",

                    data:
                        historyData,

                    borderColor:
                        "#1565c0",

                    borderWidth: 3,

                    pointRadius: 0,

                    tension: 0.3
                },

                {
                    label:
                        "Forecast",

                    data:
                        forecastData,

                    borderColor:
                        "#ff9800",

                    borderDash:
                        [6, 6],

                    borderWidth: 3,

                    pointRadius: 4,

                    tension: 0.3
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            scales: {

                x: {

                    type: "time",

                    time: {
                        unit: "hour"
                    }
                },

                y: {

                    title: {
                        display: true,
                        text: "EPA Level (m)"
                    }
                }
            }
        }
    });
}
