import fs from "fs";
import axios from "axios";

const EVENTS_URL =
"https://erddap.marine.ie/erddap/tabledap/IMI_TidePrediction_HighLow.json?stationID,time,longitude,latitude,tide_time_category,Water_Level_ODMalin&stationID=%22Ballyglass%22&time%3E=now-2days&time%3C=now%2B2days&orderBy(%22time%22)";

const SERIES_URL =
"https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.json?time,Water_Level_ODM&stationID=%22Ballyglass%22&time%3E=now-2days&time%3C=now%2B2days&orderBy(%22time%22)";

function localTime(date) {

    return new Date(date)
        .toLocaleString(
            "en-IE",
            {
                timeZone:
                    "Europe/Dublin"
            }
        );
}

function isHigh(type) {

    const t =
        String(type)
        .toLowerCase();

    return (
        t.includes("high") ||
        t === "hw"
    );
}

function isLow(type) {

    const t =
        String(type)
        .toLowerCase();

    return (
        t.includes("low") ||
        t === "lw"
    );
}

async function run() {

    console.log(
        "Downloading tide events..."
    );

    const events =
        await axios.get(
            EVENTS_URL
        );

    console.log(
        "Downloading tide series..."
    );

    const series =
        await axios.get(
            SERIES_URL
        );

    const rows =
        events.data.table.rows;

    console.log(
        "Events:",
        rows.length
    );

    const tides =
        rows.map(r => {

            const corrected =
                new Date(
                    new Date(r[1]).getTime()
                    + 3600000
                );

            return {

                time:
                    corrected,

                type:
                    r[4],

                level:
                    r[5]
            };
        });

    console.log(
        "Categories:"
    );

    tides.forEach(t => {
        console.log(t.type);
    });

    const now =
        Date.now();

    const previous =
        tides.filter(
            t =>
                t.time.getTime()
                < now
        );

    const future =
        tides.filter(
            t =>
                t.time.getTime()
                >= now
        );

    const previousLow =
        previous
            .filter(
                t =>
                    isLow(
                        t.type
                    )
            )
            .slice(-1)[0];

    const previousHigh =
        previous
            .filter(
                t =>
                    isHigh(
                        t.type
                    )
            )
            .slice(-1)[0];

    const nextHigh =
        future.find(
            t =>
                isHigh(
                    t.type
                )
        );

    const nextLow =
        future.find(
            t =>
                isLow(
                    t.type
                )
        );

    console.log(
        "Previous Low:",
        previousLow?.type
    );

    console.log(
        "Previous High:",
        previousHigh?.type
    );

    console.log(
        "Next High:",
        nextHigh?.type
    );

    console.log(
        "Next Low:",
        nextLow?.type
    );

    const output = {

        updated:
            new Date()
                .toISOString(),

        state:
            nextHigh &&
            nextLow &&
            nextHigh.time
                < nextLow.time
            ? "▲ Flood"
            : "▼ Ebb",

        currentLevel: 0,

        previousLow:
            previousLow
            ? localTime(
                previousLow.time
              )
            : "--",

        previousHigh:
            previousHigh
            ? localTime(
                previousHigh.time
              )
            : "--",

        nextHigh:
            nextHigh
            ? localTime(
                nextHigh.time
              )
            : "--",

        nextLow:
            nextLow
            ? localTime(
                nextLow.time
              )
            : "--",

        series:
            series.data.table.rows.map(
                r => ({

                    time:
                        new Date(
                            new Date(
                                r[0]
                            ).getTime()
                            + 3600000
                        ),

                    level:
                        r[1]
                })
            )
    };

    fs.writeFileSync(
        "../data/tide.json",
        JSON.stringify(
            output,
            null,
            2
        )
    );

    console.log(
        "Tides updated."
    );
}

run().catch(err => {

    console.error(err);

    process.exit(1);

});
