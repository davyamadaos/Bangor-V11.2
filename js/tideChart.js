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
            y: tide.previousLowLevel,
            label: "Prev Low"
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
            y: tide.previousHighLevel,
            label: "Prev High"
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
            y: tide.nextHighLevel,
            label: "Next High"
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
            y: tide.nextLowLevel,
            label: "Next Low"
        });
    }

    points.sort(
        (a, b) => a.x - b.x
    );

    const nowPoint = {

        x: new Date(),

        y: tide.currentLevel
    };

    tideChart = new Chart(canvas, {

        type: "line",

        data: {

            datasets: [

                {
                    label: "Tide",

                    data: points,

                    borderColor: "#1565c0",

                    backgroundColor:
                        "#1565c0",

                    borderWidth: 3,

                    tension: 0.45,

                    pointRadius: 6,

                    pointHoverRadius: 6,

                    fill: false
                },

                {
                    label: "Now",

                    data: [nowPoint],

                    showLine: false,

                    pointRadius: 8,

                    pointHoverRadius: 8,

                    pointBackgroundColor:
                        "red",

                    pointBorderColor:
                        "red"
                }
            ]
        },

        plugins: [

            {
                id: "pointLabels",

                afterDatasetsDraw(chart) {

                    const ctx = chart.ctx;

                    ctx.save();

                    ctx.font =
                        "12px sans-serif";

                    ctx.textAlign =
                        "center";

                    ctx.fillStyle =
                        "#1565c0";

                    chart
                        .getDatasetMeta(0)
                        .data
                        .forEach((point, i) => {

                            const p =
                                points[i];

                            ctx.fillText(
                                p.label,
                                point.x,
                                point.y - 42
                            );

                            ctx.fillText(
                                p.x.toLocaleString(
                                    "en-IE",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                ),
                                point.x,
                                point.y - 26
                            );

                            ctx.fillText(
                                p.y.toFixed(2)
                                + " m",
                                point.x,
                                point.y - 10
                            );
                        });

                    const now =
                        chart
                        .getDatasetMeta(1)
                        .data[0];

                    ctx.fillStyle =
                        "red";

                    ctx.fillText(
                        "Now",
                        now.x,
                        now.y - 20
                    );

                    ctx.restore();
                }
            }
        ],

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                x: {

                    type: "time",

                    time: {

                        unit: "hour",

                        displayFormats: {

                            hour: "HH:mm"
                        }
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
    });
}
