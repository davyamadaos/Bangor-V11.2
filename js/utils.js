export function fmtLevel(level) {

    return (
        Number(level)
        .toFixed(2)
        + " m"
    );
}

export function fmtTime(dateString) {

    return new Date(
        dateString
    ).toLocaleTimeString(
        "en-IE",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}
