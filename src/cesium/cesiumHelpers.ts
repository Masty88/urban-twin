import { Viewer, createWorldTerrain, createOsmBuildings } from "cesium";

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
