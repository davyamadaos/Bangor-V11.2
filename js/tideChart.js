let tideChart;

export function drawTide(
    canvas,
    tide
) {

    if (tideChart) {
        tideChart.destroy();
    }

    const points = [

        {
            x: new Date(
                tide.previousLowTime
            ),
            y: tide.previousLowLevel
        },

        {
            x: new Date(
                tide.previousHighTime
            ),
            y: tide.previousHighLevel
        },

        {
            x: new Date(
                tide.nextHighTime
            ),
            y: tide.nextHighLevel
        },

        {
            x: new Date(
                tide.nextLowTime
            ),
            y: tide.nextLowLevel
        }
    ];

    tideChart = new Chart(
        canvas,
        {

            type: "line",

            data: {

                datasets: [

                    {
                        label: "Tide",

                        data: points,

                        borderColor:
                            "#0077cc",

                        tension: 0.45,

                        pointRadius: 5
                    },

                    {
                        label: "Now",

                        data: [

                            {
                                x: new Date(),
                                y: tide.currentLevel
                            }
                        ],

                        pointRadius: 7,

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

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label(context) {

                                return (
                                    context.parsed.y
                                    .toFixed(2)
                                    + " m"
                                );
                            }
                        }
                    }
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

                            text: "m ODM"
                        }
                    }
                }
            }
        }
    );
}
