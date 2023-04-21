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

    @property({ type: String, attribute: `data` })
    data: string = '';

    @property({type: String, attribute: 'clamp-polygon'})
    clampPolygon = ''

    private _viewer: Viewer | undefined;

    override render() {
        return html`
      <div id="cesiumContainer">
      </div>
    `;
    }


    // override async attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    //     if (name.startsWith('data-') && newValue) {
    //         await (this as any).addData(newValue);
    //         console.log("here")
    //     }
    //     super.attributeChangedCallback(name, oldValue, newValue);
    // }

    override async updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('data') && this.data) {

            console.log("here")
            await (this as any).addData(this.data, this.clampPolygon);
        }
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
