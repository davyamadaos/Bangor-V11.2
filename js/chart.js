let riverChart;

export function draw(
    canvas,
    data
) {

    if (riverChart) {
        riverChart.destroy();
    }

    const riverSeries =
        (data.series || []).map(p => ({

            x: new Date(
                p.time
            ),

            y: p.level
        }));

    const forecastSeries = [];

    const now = new Date();

    if (
        data.forecast &&
        data.forecast["1h"]
    ) {

        forecastSeries.push({

            x: now,

            y: data.estimatedLevel

        });

        forecastSeries.push({

            x: new Date(
                now.getTime()
                + 3600000
            ),

            y: data.forecast["1h"].level

        });

        forecastSeries.push({

            x: new Date(
                now.getTime()
                + 10800000
            ),

            y: data.forecast["3h"].level

        });

        forecastSeries.push({

            x: new Date(
                now.getTime()
                + 21600000
            ),

            y: data.forecast["6h"].level

        });
    }

    const allLevels = [

        ...riverSeries.map(
            p => p.y
        ),

        ...forecastSeries.map(
            p => p.y
        )

    ];

    const minLevel =
        allLevels.length
            ? Math.min(...allLevels) - 0.05
            : 98.9;

    const maxLevel =
        allLevels.length
            ? Math.max(...allLevels) + 0.05
            : 100.1;

    riverChart = new Chart(
        canvas,
        {

            type: "line",

            data: {

                datasets: [

                    {
                        label:
                            "River Level",

                        data:
                            riverSeries,

                        borderColor:
                            "#1565c0",

                        backgroundColor:
                            "rgba(21,101,192,0.15)",

                        fill: true,

                        tension: 0.3,

                        pointRadius: 0,

                        borderWidth: 2
                    },

                    {
                        label:
                            "Forecast",

                        data:
                            forecastSeries,

                        borderColor:
                            "#ff9800",

                        borderDash:
                            [6, 6],

                        pointRadius:
                            3,

                        fill: false,

                        tension: 0.3
                    },

                    {
                        label:
                            "Current",

                        data: [

                            {
                                x: now,
                                y: data.estimatedLevel
                            }

                        ],

                        pointRadius: 6,

                        pointBackgroundColor:
                            "black",

                        pointBorderColor:
                            "black",

                        showLine: false
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio:
                    false,

                interaction: {

                    intersect: false,

                    mode: "index"
                },

                plugins: {

                    legend: {

                        display: true
                    }
                },

                scales: {

                    x: {

                        type: "time",

                        time: {

                            unit: "hour"
                        },

                        title: {

                            display: true,

                            text: "Time"
                        }
                    },

                    y: {

                        min: minLevel,

                        max: maxLevel,

                        title: {

                            display: true,

                            text: "EPA Level (m)"
                        }
                    }
                }
            }
        }
    );
}
