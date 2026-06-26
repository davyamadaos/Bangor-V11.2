import fs from "fs";
import axios from "axios";

const HIGHLOW_URL =
    "https://erddap.marine.ie/erddap/tabledap/IMI_TidePrediction_HighLow.json" +
    "?stationID,time,tide_time_category,Water_Level_ODMalin" +
    "&stationID=%22Ballyglass%22" +
    "&time>=now-2days" +
    "&time<=now+2days" +
    "&orderBy(%22time%22)";

const CONTINUOUS_URL =
    "https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.json" +
    "?time,stationID,Water_Level_ODM" +
    "&stationID=%22Ballyglass%22" +
    "&time>=now-1day" +
    "&time<=now+1day" +
    "&orderBy(%22time%22)";

function correctedTime(time) {

    return new Date(
        new Date(time).getTime()
        + 3600000
    );
}

function localTime(time) {

    return correctedTime(time)
        .toLocaleString(
            "en-IE",
            {
                timeZone:
                    "Europe/Dublin",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}

async function run() {

    console.log(
        "Downloading tides..."
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

    const events =
        rows.map(r => ({

            time:
                correctedTime(
                    r[1]
                ),

            type:
                r[2],

            level:
                Number(
                    r[3]
                )
        }));

    const now =
        new Date();

    const previous =
        events.filter(
            e =>
                e.time <
                now
        );

    const future =
        events.filter(
            e =>
                e.time >=
                now
        );

    const previousLow =
        [...previous]
        .reverse()
        .find(
            e =>
                e.type
                .toLowerCase()
                .includes(
                    "low"
                )
        );

    const previousHigh =
        [...previous]
        .reverse()
        .find(
            e =>
                e.type
                .toLowerCase()
                .includes(
                    "high"
                )
        );

    const nextHigh =
        future.find(
            e =>
                e.type
                .toLowerCase()
                .includes(
                    "high"
                )
        );

    const nextLow =
        future.find(
            e =>
                e.type
                .toLowerCase()
                .includes(
                    "low"
                )
        );

    const tideRows =
        continuous.data.table.rows;

    let currentLevel = 0;

    if (
        tideRows.length
    ) {

        let nearest =
            tideRows[0];

        let nearestDiff =
            Infinity;

        for (
            const row
            of tideRows
        ) {

            const t =
                correctedTime(
                    row[0]
                );

            const diff =
                Math.abs(
                    t - now
                );

            if (
                diff <
                nearestDiff
            ) {

                nearest =
                    row;

                nearestDiff =
                    diff;
            }
        }

        currentLevel =
            Number(
                nearest[2]
            );
    }

    const state =
        nextHigh &&
        nextLow &&
        nextHigh.time <
            nextLow.time
            ? "▲ Flood"
            : "▼ Ebb";

    const output = {

        updated:
            new Date()
                .toISOString(),

        state,

        currentLevel,

        previousLow:
            previousLow
                ? localTime(
                      previousLow.time
                  )
                : "--",

        previousLowTime:
            previousLow
                ? previousLow.time
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
                ? previousHigh.time
                : null,

        previousHighLevel:
            previousHigh
                ? previousHigh.level
                : null,

        nextHigh:
            nextHigh
                ? localTime(
                      nextHigh.time
                  )
                : "--",

        nextHighTime:
            nextHigh
                ? nextHigh.time
                : null,

        nextHighLevel:
            nextHigh
                ? nextHigh.level
                : null,

        nextLow:
            nextLow
                ? localTime(
                      nextLow.time
                  )
                : "--",

        nextLowTime:
            nextLow
                ? nextLow.time
                : null,

        nextLowLevel:
            nextLow
                ? nextLow.level
                : null
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
        "Tide updated."
    );

    console.log(
        output
    );
}

run().catch(err => {

    console.error(err);

    process.exit(1);
});
