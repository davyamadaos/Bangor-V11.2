export const CONFIG = {
    station: "33008",

    epaImage:
        "https://epawebapp.epa.ie/hydronet/output/internet/stations/CAS/33008/S/extralarge_3m_extralarge.png",

    gaugeMultiplier: 16.921,
    gaugeOffset: 1675.7,

    refreshMinutes: 15
};

export function toGauge(level) {
    return CONFIG.gaugeMultiplier * level - CONFIG.gaugeOffset;
}
