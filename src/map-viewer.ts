import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {createCesiumViewer, zoomToDataSource} from "./cesium/cesiumHelpers"; // <-- aggiungi l'importazione qui
import { addData } from './cesium/dataLoader';

import {styles} from "./styles/styles";
import {Viewer} from "cesium";



@customElement('map-viewer')
export class MapViewer extends LitElement{
    static override styles = styles;

    @property({ type: String, attribute: 'cesium-base-url' })
    cesiumBaseURL = '';

    @property({ type: String, attribute: 'ion-token' })
    ionToken = '';

    @property({ type: Object, converter: {
            fromAttribute: (value:any) => {
                try {
                    return new Map(JSON.parse(value));
                } catch {
                    return new Map();
                }
            },
        }})
    data: Map<string, { url: string; clamp: boolean }> = new Map();

    private _viewer: Viewer | undefined;

    override render() {
        return html`
      <div id="cesiumContainer">
      </div>
    `;
    }


    override async updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('data') && this.data.size >0) {
                for (const [_, value] of this.data.entries()) {
                    const dataSource = await addData(this._viewer,value.url, value.clamp);
                    await zoomToDataSource(this._viewer, dataSource)
                }

        }
    }

    override async firstUpdated() {
        super.connectedCallback();
        this._viewer = createCesiumViewer(
            this.shadowRoot!.getElementById("cesiumContainer")!,
            this.cesiumBaseURL
        );
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
