import axios from "axios";
import sharp from "sharp";

const URL =
    "https://epawebapp.epa.ie/hydronet/output/internet/stations/CAS/33008/S/extralarge_3m_extralarge.png";

const TOP = 250;
const BOTTOM = 435;

export async function extractLatest() {

    const response =
        await axios.get(URL, {
            responseType: "arraybuffer"
        });

    const image =
        sharp(response.data);

    const { data, info } =
        await image
            .raw()
            .toBuffer({
                resolveWithObject: true
            });

    const width = info.width;

    for (let x = 650; x >= 580; x--) {

        const ys = [];

        for (let y = TOP; y <= BOTTOM; y++) {

            const i =
                (y * width + x) * 3;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const isBlue =
                b > 120 &&
                b > r + 20 &&
                b > g + 20;

            if (isBlue) {
                ys.push(y);
            }
        }

        if (ys.length < 5)
            continue;

        const groups = [];

        let current = [ys[0]];

        for (let i = 1; i < ys.length; i++) {

            if (ys[i] <= ys[i - 1] + 2) {
                current.push(ys[i]);
            } else {
                groups.push(current);
                current = [ys[i]];
            }
        }

        groups.push(current);

        // Lowest group on chart.
        const river =
            groups[groups.length - 1];

        // Ignore tiny groups.
        if (river.length < 4)
            continue;

        return {
            x,
            y: river[0],
            count: river.length
        };
    }

    throw new Error(
        "River trace not found"
    );
}
