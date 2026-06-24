export function forecast(series) {

    if (series.length < 5) return null;

    const a = series.at(-1);
    const b = series.at(-5);

    const dt = (new Date(a.time) - new Date(b.time)) / 3600000;
    const rate = (a.level - b.level) / dt;

    const nowLag = (Date.now() - new Date(a.time)) / 3600000;

    const current = a.level + rate * nowLag;

    return {
        current,
        rateCmHr: rate * 100,
        plus1: current + rate,
        plus3: current + rate * 3,
        plus6: current + rate * 6
    };
}
