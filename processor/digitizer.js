import axios from "axios";
import sharp from "sharp";

const URL =
    "https://epawebapp.epa.ie/hydronet/output/internet/stations/CAS/33008/S/extralarge_3m_extralarge.png";

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

    for (let x = 665; x >= 620; x--) {

        const ys = [];

        for (let y = 340; y <= 435; y++) {

            const i =
                (y * width + x) * 3;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (
                b > r + 20 &&
                b > g + 20
            ) {
                ys.push(y);
            }
        }

        if (ys.length < 3)
            continue;

        const groups = [];

        let current = [ys[0]];

        for (let i = 1; i < ys.length; i++) {

            if (ys[i] <= ys[i - 1] + 8) {
                current.push(ys[i]);
            } else {
                groups.push(current);
                current = [ys[i]];
            }
        }

        groups.push(current);

        // Use the lowest group with at least 3 pixels.

        for (let i = groups.length - 1; i >= 0; i--) {

            const g = groups[i];

            if (g.length >= 3) {

                console.log("Column:", x);
                console.log(
                    "River:",
                    g[0],
                    "-",
                    g[g.length - 1]
                );

                return {
                    x,
                    y: g[0],
                    count: g.length
                };
            }
        }
    }

    throw new Error(
        "River trace not found"
    );
}
