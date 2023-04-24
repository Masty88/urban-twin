import {Viewer, createWorldTerrain, createOsmBuildings, DataSource} from "cesium";

export function createCesiumViewer(container: HTMLElement, cesiumBaseURL: string): Viewer {
    if (cesiumBaseURL) {
        window.CESIUM_BASE_URL = cesiumBaseURL;
    }

    const viewer = new Viewer(container, {
        animation: false,
        homeButton: false,
        baseLayerPicker: false,
        geocoder: false,
        infoBox: true,
        sceneModePicker: true,
        selectionIndicator: false,
        timeline: false,
        navigationInstructionsInitiallyVisible: false,
        navigationHelpButton: false,
        shadows: true,
        terrainProvider: createWorldTerrain(),
    });

    viewer.scene.primitives.add(createOsmBuildings());

    return viewer;
}

export async function zoomToDataSource(viewer: Viewer | undefined, dataSource: DataSource | undefined) {
    if (viewer && dataSource) {
        try {
            await viewer.zoomTo(dataSource);
        } catch (error) {
            console.error('Error zooming to data source:', error);
        }
    } else {
        console.error('Error: Viewer or data source is undefined');
    }
}
