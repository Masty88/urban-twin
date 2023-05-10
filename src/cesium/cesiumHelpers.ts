import {
    Viewer,
    DataSource,
    CesiumTerrainProvider
} from "cesium";

export function createCesiumViewer(container: HTMLElement, cesiumBaseURL: string, dataTerrain: string): Viewer {
    if (cesiumBaseURL) {
        window.CESIUM_BASE_URL = cesiumBaseURL;
    }

    let terrainProvider;

    try {
        terrainProvider = new CesiumTerrainProvider({
            url: dataTerrain
        });
    } catch (error) {
        // console.error('Error creating terrain provider:', error);
        // Handle the error as needed, possibly setting terrainProvider to a default value
    }

    const viewer = new Viewer(container, {
        animation: false,
        homeButton: false,
        baseLayerPicker: false,
        geocoder: false,
        infoBox: true,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationInstructionsInitiallyVisible: false,
        navigationHelpButton: false,
        shadows: true,
        scene3DOnly: true,
        terrainProvider: terrainProvider,
    });

    //viewer.scene.primitives.add(createOsmBuildings());

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
