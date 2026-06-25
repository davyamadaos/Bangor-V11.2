export async function loadTides() {

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
