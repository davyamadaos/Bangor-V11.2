export function levelFromPixel(
    y,
    topPixel,
    bottomPixel,
    topLevel,
    bottomLevel
) {

    const ratio =
        (y - topPixel)
        /
        (bottomPixel - topPixel);

    return (
        topLevel
        +
        ratio *
        (bottomLevel - topLevel)
    );
}
