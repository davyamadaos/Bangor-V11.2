let tideChart;

export function drawTide(
    canvas,
    tide
) {

    if (tideChart) {
        tideChart.destroy();
    }

    const points = [];

    if (
        tide.previousLowTime &&
        tide.previousLowLevel != null
    ) {
        points.push({
            x: new Date(
                tide.previousLowTime
            ),
            y: tide.previousLowLevel
        });
    }

    if (
        tide.previousHighTime &&
        tide.previousHighLevel != null
    ) {
        points.push({
            x: new Date(
                tide.previousHighTime
            ),
            y: tide.previousHighLevel
        });
    }

    if (
        tide.nextLowTime &&
        tide.nextLowLevel != null
    ) {
        points.push({
            x: new Date(
                tide.nextLowTime
            ),
            y: tide.nextLowLevel
        });
    }

    if (
        tide.nextHighTime &&
        tide.nextHighLevel != null
    ) {
        points.push({
            x: new Date(
                tide.nextHighTime
            ),
            y: tide.nextHighLevel
        });
    }

    console.log("Tide points:", points);

    if (points.length === 0) {

        console.error(
            "No tide points found."
        );

        return;
    }

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
                            "#1565c0",

                        backgroundColor:
                            "rgba(21,101,192,0.1)",

                        tension: 0.45,

                        pointRadius: 5,

                        borderWidth: 3,

                        fill: false
                    },

                    {
                        label: "Now",

                        data: [

                            {
                                x: new Date(),
                                y:
                                    tide.currentLevel
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
