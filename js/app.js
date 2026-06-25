import { CONFIG } from "./config.js";
import { loadData } from "./api.js";
import { render } from "./ui.js";
import { draw } from "./chart.js";

import { loadTides } from "./tide.js";
import { drawTide } from "./tideChart.js";

let selected = 24;

async function refresh() {

    try {

        // River data

        const data =
            await loadData();

        // Tide data

        const tide =
            await loadTides();

        // EPA image

        document.getElementById(
            "epaImage"
        ).src =
            CONFIG.epaImage;

        // River card

        render(data);

        // River chart

        draw(
            document.getElementById(
                "chart"
            ),
            data
        );

        // Tide card

        document.getElementById(
            "tideState"
        ).textContent =
            tide.state;

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

        // Tide chart

        drawTide(
            document.getElementById(
                "tideChart"
            ),
            tide.series,
            tide.currentLevel
        );

    } catch (err) {

        console.error(
            "Refresh failed:",
            err
        );
    }
}

document
    .querySelectorAll("button")
    .forEach(button => {

        button.onclick = () => {

            document
                .querySelectorAll(
                    "button"
                )
                .forEach(b =>
                    b.classList.remove(
                        "active"
                    )
                );

            button.classList.add(
                "active"
            );

            selected =
                +button.dataset.h;

            refresh();
        };
    });

refresh();

setInterval(
    refresh,
    CONFIG.refreshMinutes * 60000
);
