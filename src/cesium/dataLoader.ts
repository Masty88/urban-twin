import {Color, DataSource, Entity, GeoJsonDataSource, JulianDate} from "cesium";

export async function addData(viewer: any, data: string, clamp: boolean) : Promise< DataSource | undefined> {
    try {
        GeoJsonDataSource.clampToGround = true
        const dataSource = await GeoJsonDataSource.load(data);
        viewer.dataSources.add(dataSource);
        clamp && clampPolygonsToGround(viewer,dataSource);
        return dataSource
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return undefined;
}

function clampPolygonsToGround(viewer: any,dataSource: DataSource) {
    const entities = dataSource.entities.values;
    entities.forEach((e: Entity) => {
        if (e.polygon?.hierarchy) {
            viewer.entities.add({
                polyline: {
                    positions: e.polygon.hierarchy.getValue(JulianDate.now()).positions,
                    width: 3,
                    material: Color.YELLOW.withAlpha(0.5),
                    clampToGround: true,
                },
            });
            dataSource.entities.remove(e);
        }
    });
}
