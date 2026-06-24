import axios from "axios";
import sharp from "sharp";

const URL =
    "https://epawebapp.epa.ie/hydronet/output/internet/stations/CAS/33008/S/extralarge_3m_extralarge.png";

const TOP = 24;
const BOTTOM = 435;

export async function extractLatest() {

    const response = await axios.get(URL, {
        responseType: "arraybuffer"
    });

    const image = sharp(response.data);

    const { data, info } =
        await image
            .raw()
            .toBuffer({
                resolveWithObject: true
            });

    const width = info.width;

    for (let x = 650; x >= 560; x--) {

        const ys = [];

        for (let y = TOP; y <= BOTTOM; y++) {

            const i = (y * width + x) * 3;

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

        // Filled area should be substantial.

        if (ys.length >= 20) {

            return {
                x,
                y: ys[0],
                count: ys.length
            };
        }
    }

    throw new Error(
        "River trace not found"
    );
}
