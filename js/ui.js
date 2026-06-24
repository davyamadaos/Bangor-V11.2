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
        fmtLevel(data.estimatedLevel);

    document.getElementById(
        "currentGauge"
    ).textContent =
        "Gauge " +
        estimatedGauge.toFixed(1);

    document.getElementById(
        "epaLevel"
    ).textContent =
        fmtLevel(data.epaLevel);

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

    document.getElementById(
        "f1Level"
    ).textContent =
        fmtLevel(
            data.forecast["1h"].level
        );

    document.getElementById(
        "f1Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast["1h"].level
        ).toFixed(2);

    document.getElementById(
        "f3Level"
    ).textContent =
        fmtLevel(
            data.forecast["3h"].level
        );

    document.getElementById(
        "f3Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast["3h"].level
        ).toFixed(2);

    document.getElementById(
        "f6Level"
    ).textContent =
        fmtLevel(
            data.forecast["6h"].level
        );

    document.getElementById(
        "f6Gauge"
    ).textContent =
        "Gauge " +
        toGauge(
            data.forecast["6h"].level
        ).toFixed(2);

    if (data.updated) {

        document.getElementById(
            "updatedTime"
        ).textContent =
            fmtTime(data.updated);
    }
}
