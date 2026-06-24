import fs from "fs";

import { extractLatest }
    from "./digitizer.js";

import { levelFromPixel }
    from "./scale.js";

const TOP_PIXEL = 24;
const BOTTOM_PIXEL = 435;

const TOP_LEVEL = 100.15;
const BOTTOM_LEVEL = 98.90;

function toGauge(level) {

    return (
        16.921 * level
        - 1675.7
    );
}

function forecast(
    level,
    rateCmHr,
    hours
) {

    return (
        level
        +
        (rateCmHr / 100)
        * hours
    );
}

async function run() {

    console.log(
        "Starting processor..."
    );

    const latest =
        await extractLatest();

    console.log(
        "Latest X:",
        latest.x
    );

    console.log(
        "Latest Y:",
        latest.y
    );

    console.log(
        "Blue pixels:",
        latest.count
    );

    const epaLevel =
        levelFromPixel(
            latest.y,
            TOP_PIXEL,
            BOTTOM_PIXEL,
            TOP_LEVEL,
            BOTTOM_LEVEL
        );

    console.log(
        "EPA level:",
        epaLevel.toFixed(3)
    );

    const rateCmHr = 0;

    const estimatedLevel =
        epaLevel;

    const gaugeLevel =
        toGauge(
            estimatedLevel
        );

    const now =
        new Date();

    const output = {

        updated:
            now.toISOString(),

        epaLevel:
            Number(
                epaLevel.toFixed(3)
            ),

        estimatedLevel:
            Number(
                estimatedLevel.toFixed(3)
            ),

        gaugeLevel:
            Number(
                gaugeLevel.toFixed(2)
            ),

        ageHours: 0,

        rate:
            rateCmHr,

        forecast: {

            "1h": {

                level:
                    Number(
                        forecast(
                            estimatedLevel,
                            rateCmHr,
                            1
                        ).toFixed(3)
                    )
            },

            "3h": {

                level:
                    Number(
                        forecast(
                            estimatedLevel,
                            rateCmHr,
                            3
                        ).toFixed(3)
                    )
            },

            "6h": {

                level:
                    Number(
                        forecast(
                            estimatedLevel,
                            rateCmHr,
                            6
                        ).toFixed(3)
                    )
            }
        },

        series: [

            {
                time:
                    now.toISOString(),

                level:
                    Number(
                        estimatedLevel.toFixed(3)
                    )
            }
        ]
    };

    fs.writeFileSync(
        "../data/latest.json",
        JSON.stringify(
            output,
            null,
            2
        )
    );

    console.log(
        "Gauge:",
        gaugeLevel.toFixed(2)
    );

    console.log(
        "JSON updated."
    );
}

run().catch(err => {

    console.error(err);

    process.exit(1);

});
