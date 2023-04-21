import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createWorldTerrain,createOsmBuildings,Viewer } from 'cesium';
import {styles} from "./styles/styles";
import {CesiumDataSourceMixin} from "./mixins/dataMixin";


@customElement('map-viewer')
export class MapViewer extends CesiumDataSourceMixin(LitElement){
    static override styles = styles;
    @property({ type: String, attribute: 'cesium-base-url' })
    cesiumBaseURL = '';

    @property({ type: String, attribute: 'ion-token' })
    ionToken = '';

    @property({ type: Object, converter: {
            fromAttribute: (value:any) => {
                try {
                    console.log(value)
                    return new Map(JSON.parse(value));
                } catch {
                    return new Map();
                }
            },
            toAttribute: (value:any) => JSON.stringify(Array.from(value.entries()))
        }})
    data: Map<string, { url: string; clamp: boolean }> = new Map();
    //
    // @property({type: String})
    // data=""

    private _viewer: Viewer | undefined;

    override render() {
        return html`
      <div id="cesiumContainer">
      </div>
    `;
    }


    override async updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('data') && this.data.size >0) {
                for (const [key, value] of this.data.entries()) {
                    await (this as any).addData(value.url, value.clamp);
                }
        }
        // console.log(Array.from(this.data.entries()));
    }

    override async firstUpdated() {
        super.connectedCallback();

        if (this.cesiumBaseURL) {
            window.CESIUM_BASE_URL = this.cesiumBaseURL;
        }

        this._viewer = new Viewer(
            this.shadowRoot!.getElementById('cesiumContainer')!,
            {
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
                terrainProvider : createWorldTerrain()
            }
        );

        this._viewer?.scene.primitives.add(createOsmBuildings());
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
