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
    "nextLow"
).textContent =
    tide.nextLow;

document.getElementById(
    "nextHigh"
).textContent =
    tide.nextHigh;

document.getElementById(
    "labelPrevLow"
).textContent =
    tide.previousLow;

document.getElementById(
    "labelPrevHigh"
).textContent =
    tide.previousHigh;

document.getElementById(
    "labelNextLow"
).textContent =
    tide.nextLow;

document.getElementById(
    "labelNextHigh"
).textContent =
    tide.nextHigh;

drawTide(
    document.getElementById(
        "tideChart"
    ),
    tide
);
