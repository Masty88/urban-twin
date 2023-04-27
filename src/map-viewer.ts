import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {createCesiumViewer, zoomToDataSource} from "./cesium/cesiumHelpers";
import {addData, drawContour} from './cesium/dataLoader';

import {styles} from "./styles/styles";
import {DataSource, Viewer} from "cesium";



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
    data: Map<string, { url: string; contour: boolean, icon: string | undefined, dataSource:DataSource | undefined  }> = new Map();

    private _viewer: Viewer | undefined;

    override render() {
        return html`
      <div id="cesiumContainer">
      </div>
      <div id="buttonContainer">
          ${Array.from(this.data.entries()).map(
                  ([key, value]) => html`
            <button
              class="toggleButton"
              @click="${() => this.toggleDataVisibility(key)}"
            >
                ${value.icon ? html`<img class="icon" src="${value.icon}" alt="Icon for ${key}" width="25" height="25">` : ''}
            </button>
          `
          )}
      </div>
    `;
    }

    toggleDataVisibility(key: string) {
        const data  = this.data.get(key);
        console.log("key is " + key)
        if (data && data.dataSource) {
            data.dataSource.show = !data.dataSource.show;
        }
    }


    override async updated(changedProperties: Map<string, unknown>) {
        console.log("updated")
        if (changedProperties.has('data') && this.data.size >0) {
                for (const [_, value] of this.data.entries()) {
                    console.log(value)
                    const dataSource = await addData(this._viewer,value.url, value.contour);
                    await zoomToDataSource(this._viewer, dataSource)
                    value.dataSource = dataSource;
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
