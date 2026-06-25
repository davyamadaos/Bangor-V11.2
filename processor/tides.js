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

async function run() {

    const events =
        await axios.get(
            EVENTS_URL
        );

    const series =
        await axios.get(
            SERIES_URL
        );

    const now =
        Date.now();

    const rows =
        events.data.table.rows;

    const tides =
        rows.map(r => {

            const t =
                new Date(
                    r[1]
                );

            t.setHours(
                t.getHours()
                + 1
            );

            return {

                time:
                    t,

                type:
                    r[4],

                level:
                    r[5]
            };
        });

    const previous =
        tides.filter(
            t =>
                t.time
                < now
        );

    const future =
        tides.filter(
            t =>
                t.time
                > now
        );

    const previousLow =
        previous
            .filter(
                t =>
                    t.type
                    === "Low"
            )
            .slice(-1)[0];

    const previousHigh =
        previous
            .filter(
                t =>
                    t.type
                    === "High"
            )
            .slice(-1)[0];

    const nextHigh =
        future.find(
            t =>
                t.type
                === "High"
        );

    const nextLow =
        future.find(
            t =>
                t.type
                === "Low"
        );

    const output = {

        state:
            nextHigh.time
            < nextLow.time
            ? "▲ Flood"
            : "▼ Ebb",

        currentLevel:
            0,

        previousLow:
            localTime(
                previousLow.time
            ),

        previousHigh:
            localTime(
                previousHigh.time
            ),

        nextHigh:
            localTime(
                nextHigh.time
            ),

        nextLow:
            localTime(
                nextLow.time
            ),

        series:
            series.data.table.rows.map(
                r => ({

                    time:
                        new Date(
                            new Date(r[0])
                            .getTime()
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

run();
