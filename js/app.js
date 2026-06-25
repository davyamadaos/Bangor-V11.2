import { CONFIG } from "./config.js";

import { loadData } from "./api.js";

import { render } from "./ui.js";

import { draw } from "./chart.js";

import { drawTide } from "./tideChart.js";

let selected = 24;

async function loadTides() {

    const response =
        await fetch(
            "data/tide.json?t="
            + Date.now()
        );

    if (!response.ok) {
        throw new Error(
            "Tide load failed"
        );
    }

    return await response.json();
}

async function refresh() {

    try {

        const data =
            await loadData();

        const tide =
            await loadTides();

        document.getElementById(
            "epaImage"
        ).src =
            CONFIG.epaImage;

        render(data);

        draw(
            document.getElementById(
                "chart"
            ),
            data
        );

        document.getElementById(
            "tideState"
        ).textContent =
            tide.state || "--";

        document.getElementById(
            "prevLow"
        ).textContent =
            tide.previousLow || "--";

        document.getElementById(
            "prevHigh"
        ).textContent =
            tide.previousHigh || "--";

        document.getElementById(
            "nextLow"
        ).textContent =
            tide.nextLow || "--";

        document.getElementById(
            "nextHigh"
        ).textContent =
            tide.nextHigh || "--";

        document.getElementById(
            "labelPrevLow"
        ).textContent =
            tide.previousLow || "";

        document.getElementById(
            "labelPrevHigh"
        ).textContent =
            tide.previousHigh || "";

        document.getElementById(
            "labelNextLow"
        ).textContent =
            tide.nextLow || "";

        document.getElementById(
            "labelNextHigh"
        ).textContent =
            tide.nextHigh || "";

        drawTide(
            document.getElementById(
                "tideChart"
            ),
            tide
        );

    } catch (err) {

        console.error(err);
    }
}

document
    .querySelectorAll(
        ".buttons button"
    )
    .forEach(button => {

        button.onclick = () => {

            document
                .querySelectorAll(
                    ".buttons button"
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
    CONFIG.refreshMinutes
    * 60000
);
