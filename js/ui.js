import { fmtLevel } from "./utils.js";
import { toGauge } from "./config.js";
import { trend } from "./trend.js";
import { drawTide } from "./tideChart.js";

export function render(
    data
) {

    document.getElementById(
        "currentLevel"
    ).textContent =
        fmtLevel(
            data.estimatedLevel
        );

    document.getElementById(
        "currentGauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.estimatedLevel
        ).toFixed(2);

    document.getElementById(
        "epaLevel"
    ).textContent =
        fmtLevel(
            data.epaLevel
        );

    document.getElementById(
        "epaGauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.epaLevel
        ).toFixed(2);

    document.getElementById(
        "epaAge"
    ).textContent =
        data.ageHours.toFixed(
            1
        ) + " h old";

    const t =
        trend(data.rate);

    const trendEl =
        document.getElementById(
            "trend"
        );

    trendEl.textContent =
        t.text;

    trendEl.className =
        t.class;

    document.getElementById(
        "f1Level"
    ).textContent =
        fmtLevel(
            data.forecast[
                "1h"
            ].level
        );

    document.getElementById(
        "f1Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast[
                "1h"
            ].level
        ).toFixed(2);

    document.getElementById(
        "f3Level"
    ).textContent =
        fmtLevel(
            data.forecast[
                "3h"
            ].level
        );

    document.getElementById(
        "f3Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast[
                "3h"
            ].level
        ).toFixed(2);

    document.getElementById(
        "f6Level"
    ).textContent =
        fmtLevel(
            data.forecast[
                "6h"
            ].level
        );

    document.getElementById(
        "f6Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast[
                "6h"
            ].level
        ).toFixed(2);

    if (
        data.updated
    ) {

        document.getElementById(
            "updatedTime"
        ).textContent =
            new Date(
                data.updated
            ).toLocaleString(
                "en-IE"
            );
    }

    if (
        data.tide
    ) {

        const tide =
            data.tide;

        const state =
            document.getElementById(
                "tideState"
            );

        state.textContent =
            tide.state;

        if (
            tide.state.includes(
                "Flood"
            )
        ) {

            state.style.color =
                "green";

        } else {

            state.style.color =
                "red";
        }

        document.getElementById(
            "prevLow"
        ).textContent =
            tide.previousLow;

        document.getElementById(
            "prevHigh"
        ).textContent =
            tide.previousHigh;

        document.getElementById(
            "nextHigh"
        ).textContent =
            tide.nextHigh;

        document.getElementById(
            "nextLow"
        ).textContent =
            tide.nextLow;

        drawTide(
            document.getElementById(
                "tideChart"
            ),
            tide
        );
    }
}
