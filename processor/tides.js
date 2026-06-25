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

    currentLevel:
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
