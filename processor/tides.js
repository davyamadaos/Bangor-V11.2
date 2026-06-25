const output = {

    updated:
        new Date()
            .toISOString(),

    state:
        nextHigh &&
        nextLow &&
        nextHigh.time <
        nextLow.time
            ? "▲ Flood"
            : "▼ Ebb",

    currentLevel: 0,

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
            : null
};
