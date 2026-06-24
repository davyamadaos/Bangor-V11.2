export async function loadData() {

    const r = await fetch("data/latest.json?t=" + Date.now());

    if (!r.ok) throw new Error("Load failed");

    return await r.json();
}
