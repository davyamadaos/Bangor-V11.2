import fs from "fs/promises";
import axios from "axios";

const HIGHLOW_URL =
    "https://erddap.marine.ie/erddap/tabledap/IMI_TidePrediction_HighLow.json?stationID,time,longitude,latitude,tide_time_category,Water_Level_ODMalin&stationID=%22Ballyglass%22&time%3E=now-3days&time%3C=now%2B3days&orderBy(%22time%22)";

const CONTINUOUS_URL =
    "https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.json?time,stationID,Water_Level_ODM&stationID=%22Ballyglass%22&time%3E=now-12hours&time%3C=now%2B12hours&orderBy(%22time%22)";

function correctedTime(utc) {

    return new Date(
        new Date(utc).getTime()
        + 3600000
    );
}

function localTime(utc) {

    return correctedTime(utc)
        .toLocaleString(
            "en-IE",
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Europe/Dublin"
            }
        );
}

async function run() {

    console.log(
        "Downloading tide data..."
    );

    const highlow =
        await axios.get(
            HIGHLOW_URL
        );

    const continuous =
        await axios.get(
            CONTINUOUS_URL
        );

    const rows =
        highlow.data.table.rows;

    const now =
        Date.now();

    const events =
        rows.map(r => ({

            time: r[1],

            category:
                r[4],

            level:
                Number(r[5])
        }));

    const lows =
        events.filter(
            e =>
                e.category
                    .toLowerCase()
                    .includes("low")
        );

    const highs =
        events.filter(
            e =>
                e.category
                    .toLowerCase()
                    .includes("high")
        );

    const previousLow =
        [...lows]
        .reverse()
        .find(
            e =>
                correctedTime(
                    e.time
                ).getTime()
                < now
        );

    const previousHigh =
        [...highs]
        .reverse()
        .find(
            e =>
                correctedTime(
                    e.time
                ).getTime()
                < now
        );

    const nextLow =
        lows.find(
            e =>
                correctedTime(
                    e.time
                ).getTime()
                > now
        );

    const nextHigh =
        highs.find(
            e =>
                correctedTime(
                    e.time
                ).getTime()
                > now
        );

    let currentLevel = 0;

    if (
        continuous.data &&
        continuous.data.table &&
        continuous.data.table.rows
    ) {

        const tideRows =
            continuous
                .data
                .table
                .rows;

        let closest =
            tideRows[0];

        let bestDiff =
            Infinity;

        for (
            const row
            of tideRows
        ) {

            const t =
                correctedTime(
                    row[0]
                ).getTime();

            const diff =
                Math.abs(
                    t - now
                );

            if (
                diff <
                bestDiff
            ) {

                bestDiff =
                    diff;

                closest =
                    row;
            }
        }

        currentLevel =
            Number(
                closest[2]
            );
    }

    const output = {

        updated:
            new Date()
                .toISOString(),

        state:
            nextHigh &&
            nextLow &&
            correctedTime(
                nextHigh.time
            ).getTime()
            <
            correctedTime(
                nextLow.time
            ).getTime()
                ? "▲ Flood"
                : "▼ Ebb",

        currentLevel,

        previousLow:
            previousLow
                ? localTime(
                    previousLow.time
                  )
                : "--",

        previousLowTime:
            previousLow
                ? correctedTime(
                    previousLow.time
                  ).toISOString()
                : null,

        previousLowLevel:
            previousLow
                ? previousLow.level
                : null,

        previousHigh:
            previousHigh
                ? localTime(
                    previousHigh.time
                  )
                : "--",

        previousHighTime:
            previousHigh
                ? correctedTime(
                    previousHigh.time
                  ).toISOString()
                : null,

        previousHighLevel:
            previousHigh
                ? previousHigh.level
                : null,

        nextLow:
            nextLow
                ? localTime(
                    nextLow.time
                  )
                : "--",

        nextLowTime:
            nextLow
                ? correctedTime(
                    nextLow.time
                  ).toISOString()
                : null,

        nextLowLevel:
            nextLow
                ? nextLow.level
                : null,

        nextHigh:
            nextHigh
                ? localTime(
                    nextHigh.time
                  )
                : "--",

        nextHighTime:
            nextHigh
                ? correctedTime(
                    nextHigh.time
                  ).toISOString()
                : null,

        nextHighLevel:
            nextHigh
                ? nextHigh.level
                : null
    };

    await fs.writeFile(
        "../data/tide.json",
        JSON.stringify(
            output,
            null,
            2
        )
    );

    console.log(
        "Tide JSON updated."
    );
}

run().catch(err => {

    console.error(err);

    process.exit(1);
});
