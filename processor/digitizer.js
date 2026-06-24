import axios from "axios";
import sharp from "sharp";

const URL =
    "https://epawebapp.epa.ie/hydronet/output/internet/stations/CAS/33008/S/extralarge_3m_extralarge.png";

const LEFT = 65;
const RIGHT = 672;

const TOP = 24;
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

    for (
        let x = RIGHT;
        x >= RIGHT - 80;
        x--
    ) {

        const ys = [];

        for (
            let y = TOP;
            y <= BOTTOM;
            y++
        ) {

            const i =
                (y * width + x) * 3;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (
                b > 140 &&
                b > r + 30 &&
                b > g + 30
            ) {
                ys.push(y);
            }
        }

        // Ignore isolated blue pixels.

        if (ys.length >= 6) {

            ys.sort((a, b) => a - b);

            const y =
                ys[Math.floor(
                    ys.length / 2 in
                )];

            return {
                x,
                y
            };
        }
    }

    throw new Error(
        "No river trace found"
    );
}
