export function computeForecast(series) {

    const n = series.length;

    if (n < 12) {

        return null;
    }

    const latest =
        series[n - 1];

    const previous =
        series[
            Math.max(0, n - 9)
        ];

    const hours =

        (new Date(latest.time)
        - new Date(previous.time))

        / 3600000;

    const rateMhr =

        (latest.level
        - previous.level)

        / hours;

    const rateCmHr =
        rateMhr * 100;

    const ageHours =

        (Date.now()
        - new Date(latest.time))

        / 3600000;

    const estimated =

        latest.level
        + (rateMhr * ageHours);

    return {

        epaLevel:
            latest.level,

        estimatedLevel:
            estimated,

        rateCmHr,

        ageHours,

        plus1:
            estimated
            + rateMhr,

        plus3:
            estimated
            + rateMhr * 3,

        plus6:
            estimated
            + rateMhr * 6
    };
}
