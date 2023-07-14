import {
    Cesium3DTileset,
    Color,
    ColorMaterialProperty,
    DataSource,
    Entity,
    GeoJsonDataSource,
    JulianDate,
    PointGraphics
} from "cesium";


// Créez une Map pour stocker les associations couleur/valeur
const colorizeMap = new Map();
const legend = new Map<string, Color>();

function hashStringToColor(str: string): Color {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return Color.fromCssColorString("#" + "00000".substring(0, 6 - c.length) + c);
}

function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
}

function generateColor(value: number): Color {
    const normalizedValue = value / 70000;

    const startColor = Color.ORANGE;
    const endColor = Color.YELLOW;

    const red = lerp(startColor.red, endColor.red, normalizedValue);
    const green = lerp(startColor.green, endColor.green, normalizedValue);
    const blue = lerp(startColor.blue, endColor.blue, normalizedValue);

    return new Color(red, green, blue, 1); // L'ultimo parametro è l'alpha (trasparenza), che qui è impostato al massimo (nessuna trasparenza)
}


export async function addData(viewer: any, data: string, contour: boolean, colorize: string | undefined) : Promise< DataSource | undefined> {
    try {
        GeoJsonDataSource.clampToGround = true;

        const dataSource = await GeoJsonDataSource.load(data, {
            // Aggiunge una funzione per personalizzare l'aspetto delle entità
            clampToGround: true,
        });

        // Itera su tutte le entità del DataSource
        dataSource.entities.values.forEach((entity: Entity) => {
            // Se l'entità ha una proprietà "zone", usa il colore corrispondente dalla funzione di hash

            entity.billboard = undefined;
            entity.point = new PointGraphics({
                color: Color.GREEN,
                pixelSize: 15
            });
            entity.label = undefined;
            if (entity.properties) {
                const kWh = entity.properties['kWh'];
                if (kWh) {
                    const value = kWh.getValue();
                    console.log('value',typeof value)
                    if (typeof value === 'number') {
                        // Genera un colore basato sul valore kWh
                        const color = generateColor(value);
                        if (entity.polygon) {
                            entity.polygon.material = new ColorMaterialProperty(color);
                        }
                    }
                }
            }
            if (entity.properties && entity.properties[colorize]) {
                // @ts-ignore
                const zone = entity.properties[colorize].getValue();
                let color = colorizeMap.get(zone);

                if (!color) {
                    color = hashStringToColor(zone);  // use the same color generation function
                    colorizeMap.set(zone, color);
                }

                // Also store the color/value association in the legend
                legend.set(zone, color);

                if (zone && entity.polygon) {
                    entity.polygon.material = new ColorMaterialProperty(color);
                }
            }
        });

        viewer.dataSources.add(dataSource);
        dataSource.show = false;
        contour && drawContour(viewer, dataSource);
        return dataSource;
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return undefined;
}

export function addTileset(viewer: any, url: string) {
        // @ts-ignore
    const tileset = viewer.scene.primitives.add(new Cesium3DTileset({url}));
    return tileset;
}

export function drawContour(viewer: any, dataSource: DataSource) {
    const entities = dataSource.entities.values;
    entities.forEach((e: Entity) => {
        if (e.polygon?.hierarchy) {
            // Set the material color to fully transparent
            // e.polygon.material = new ColorMaterialProperty(Color.TRANSPARENT);
            // Add a polyline for the contour
            viewer.entities.add({
                polyline: {
                    positions: e.polygon.hierarchy.getValue(JulianDate.now()).positions,
                    width: 3,
                    material: Color.YELLOW.withAlpha(0.5),
                    clampToGround: true,
                    show: true,
                },
            });
        }
    });
}

export { legend };
