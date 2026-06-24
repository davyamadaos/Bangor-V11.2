import { fmtLevel, fmtTime } from "./utils.js";
import { trend } from "./trend.js";
import { toGauge } from "./config.js";

export function render(data) {

    const estimatedGauge =
        toGauge(data.estimatedLevel);

    const epaGauge =
        toGauge(data.epaLevel);

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
        estimatedGauge.toFixed(1);

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
        epaGauge.toFixed(1);

    document.getElementById(
        "epaAge"
    ).textContent =
        data.ageHours.toFixed(1)
        + " h old";

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

    if (data.forecast) {

        const f1 =
            data.forecast["1h"]?.level ??
            data.estimatedLevel;

        const f3 =
            data.forecast["3h"]?.level ??
            data.estimatedLevel;

        const f6 =
            data.forecast["6h"]?.level ??
            data.estimatedLevel;

        document.getElementById(
            "f1Level"
        ).textContent =
            fmtLevel(f1);

        document.getElementById(
            "f1Gauge"
        ).textContent =
            "Gauge " +
            toGauge(f1)
                .toFixed(1);

        document.getElementById(
            "f3Level"
        ).textContent =
            fmtLevel(f3);

        document.getElementById(
            "f3Gauge"
        ).textContent =
            "Gauge " +
            toGauge(f3)
                .toFixed(1);

        document.getElementById(
            "f6Level"
        ).textContent =
            fmtLevel(f6);

        document.getElementById(
            "f6Gauge"
        ).textContent =
            "Gauge " +
            toGauge(f6)
                .toFixed(1);
    }

    if (data.updated) {

        document.getElementById(
            "updatedTime"
        ).textContent =
            fmtTime(
                data.updated
            );
    }
}
