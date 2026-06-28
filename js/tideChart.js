let tideChart;

export function drawTide(
    canvas,
    tide
) {

    if (tideChart) {
        tideChart.destroy();
    }

    if (
        !tide.continuous ||
        !tide.continuous.length
    ) {
        return;
    }

    const now =
        new Date();

    const series =
        tide.continuous.map(p => ({

            x: new Date(
                p.time
            ),

            y: p.level
        }));

    let nearest =
        series[0];

    let nearestDiff =
        Infinity;

    for (
        const p of series
    ) {

        const diff =
            Math.abs(
                p.x - now
            );

        if (
            diff <
            nearestDiff
        ) {

            nearest =
                p;

            nearestDiff =
                diff;
        }
    }

    const left =
        new Date(
            now.getTime()
            - 12 * 3600000
        );

    const right =
        new Date(
            now.getTime()
            + 12 * 3600000
        );

    const tidePoints = [];

    if (
        tide.previousLowTime &&
        tide.previousLowLevel != null
    ) {

        tidePoints.push({

            x:
                new Date(
                    tide.previousLowTime
                ),

            y:
                tide.previousLowLevel,

            label:
                "Low"
        });
    }

    if (
        tide.previousHighTime &&
        tide.previousHighLevel != null
    ) {

        tidePoints.push({

            x:
                new Date(
                    tide.previousHighTime
                ),

            y:
                tide.previousHighLevel,

            label:
                "High"
        });
    }

    if (
        tide.nextHighTime &&
        tide.nextHighLevel != null
    ) {

        tidePoints.push({

            x:
                new Date(
                    tide.nextHighTime
                ),

            y:
                tide.nextHighLevel,

            label:
                "High"
        });
    }

    if (
        tide.nextLowTime &&
        tide.nextLowLevel != null
    ) {

        tidePoints.push({

            x:
                new Date(
                    tide.nextLowTime
                ),

            y:
                tide.nextLowLevel,

            label:
                "Low"
        });
    }

    tideChart = new Chart(
        canvas,
        {

            type: "line",

            data: {

                datasets: [

                    {
                        label:
                            "Tide",

                        data:
                            series,

                        borderColor:
                            "#1565c0",

                        backgroundColor:
                            "rgba(21,101,192,0.20)",

                        borderWidth:
                            3,

                        fill:
                            true,

                        tension:
                            0.4,

                        pointRadius:
                            0
                    },

                    {
                        label:
                            "Extrema",

                        data:
                            tidePoints,

                        borderWidth:
                            0,

                        pointRadius:
                            6,

                        pointHoverRadius:
                            6,

                        pointBackgroundColor:
                            "#1565c0",

                        pointBorderColor:
                            "#ffffff",

                        pointBorderWidth:
                            2,

                        showLine:
                            false
                    },

                    {
                        label:
                            "Now",

                        data: [

                            {
                                x:
                                    nearest.x,

                                y:
                                    nearest.y
                            }

                        ],

                        pointRadius:
                            8,

                        pointHoverRadius:
                            8,

                        pointBackgroundColor:
                            "red",

                        pointBorderColor:
                            "white",

                        pointBorderWidth:
                            3,

                        showLine:
                            false
                    },

                    {
                        label:
                            "NowLine",

                        data: [

                            {
                                x: now,
                                y: -2
                            },

                            {
                                x: now,
                                y: 2
                            }

                        ],

                        borderColor:
                            "red",

                        borderDash:
                            [6,6],

                        borderWidth:
                            2,

                        pointRadius:
                            0
                    }
                ]
            },

            plugins: [

                {
                    id:
                        "tideLabels",

                    afterDatasetsDraw(chart) {

                        const ctx =
                            chart.ctx;

                        ctx.save();

                        ctx.font =
                            "12px sans-serif";

                        ctx.fillStyle =
                            "#444";

                        ctx.textAlign =
                            "center";

                        chart
                            .getDatasetMeta(1)
                            .data
                            .forEach(
                                (
                                    point,
                                    i
                                ) => {

                                    const p =
                                        tidePoints[i];

                                    const t =
                                        p.x.toLocaleString(
                                            "en-IE",
                                            {
                                                day:
                                                    "numeric",

                                                month:
                                                    "short",

                                                hour:
                                                    "2-digit",

                                                minute:
                                                    "2-digit"
                                            }
                                        );

                                    ctx.fillText(
                                        p.label,
                                        point.x,
                                        point.y
                                        - 28
                                    );

                                    ctx.fillText(
                                        t,
                                        point.x,
                                        point.y
                                        - 14
                                    );
                                }
                            );

                        ctx.fillStyle =
                            "red";

                        const nowPoint =
                            chart
                            .getDatasetMeta(2)
                            .data[0];

                        ctx.fillText(
                            "NOW",
                            nowPoint.x,
                            nowPoint.y
                            - 18
                        );

                        ctx.restore();
                    }
                }
            ],

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                animation:
                    false,

                plugins: {

                    legend: {

                        display:
                            false
                    }
                },

                scales: {

                    x: {

                        type:
                            "time",

                        min:
                            left,

                        max:
                            right,

                        time: {

                            unit:
                                "hour",

                            displayFormats: {

                                hour:
                                    "HH:mm"
                            }
                        },

                        ticks: {

                            maxRotation:
                                0,

                            autoSkip:
                                true
                        },

                        grid: {

                            color:
                                "#eeeeee"
                        }
                    },

                    y: {

                        title: {

                            display:
                                true,

                            text:
                                "m ODM"
                        },

                        grid: {

                            color:
                                "#eeeeee"
                        }
                    }
                }
            }
        }
    );
}
