export async function loadTides() {

    const response =
        await fetch(
            "data/tide.json?t="
            + Date.now()
        );

    return await response.json();
}
