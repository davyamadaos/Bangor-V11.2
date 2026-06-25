let tideChart;

export function drawTide(
    canvas,
    series,
    current
) {

    if (tideChart)
        tideChart.destroy();

    tideChart =
        new Chart(canvas, {

            type: "line",

            data: {

                datasets: [

                    {
                        label: "Tide",

                        data:
                            series.map(
                                p => ({
                                    x:
                                        new Date(
                                            p.time
                                        ),
                                    y:
                                        p.level
                                })
                            ),

                        borderColor:
                            "#0088cc",

                        tension: 0.4,

                        pointRadius: 0
                    },

                    {
                        label:
                            "Now",

                        data: [
                            {
                                x:
                                    new Date(),

                                y:
                                    current
                            }
                        ],

                        pointRadius: 6,

                        showLine:
                            false
                    }
                ]
            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                scales: {

                    x: {
                        type:
                            "time"
                    },

                    y: {
                        title: {
                            display:
                                true,

                            text:
                                "m ODM"
                        }
                    }
                }
            }
        });
}
