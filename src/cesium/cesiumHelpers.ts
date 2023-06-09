import {
    Viewer,
    DataSource,
    CesiumTerrainProvider
} from "cesium";
import * as Cesium from "cesium";

export function createCesiumViewer(container: HTMLElement, cesiumBaseURL: string): Viewer {
    if (cesiumBaseURL) {
        window.CESIUM_BASE_URL = cesiumBaseURL;
    }

    let terrainProvider;

    try {
        terrainProvider = new CesiumTerrainProvider({
            url: "https://3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20160115/4326/"
        });
    } catch (error) {
        // console.error('Error creating terrain provider:', error);
        // Handle the error as needed, possibly setting terrainProvider to a default value
    }

    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWJiNzJiMC1hZGNmLTRhYTctOGYwZS02ZDBiYmQ0NjU4NTgiLCJpZCI6MTE1OTcwLCJpYXQiOjE2NjkyODY0Njd9.JAp-JdI_eee7oBE2E8gUhB-By3XaUHCLhZ0YnW0znpo";


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
    viewer.scene.globe.depthTestAgainstTerrain = true;
    console.log("viewer created")
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
