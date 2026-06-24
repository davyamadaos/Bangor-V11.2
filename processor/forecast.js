export function forecast(series) {

    const n = series.length;

    const a = series[n - 1];
    const b = series[Math.max(0, n - 6)];

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
