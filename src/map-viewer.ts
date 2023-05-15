import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {createCesiumViewer, zoomToDataSource} from "./cesium/cesiumHelpers";
import {addData, addTileset} from './cesium/dataLoader';

import {styles} from "./styles/styles";
import {Cesium3DTileset, DataSource, Viewer} from "cesium";

import apiService from './api/apiService';



@customElement('map-viewer')
export class MapViewer extends LitElement{
    static override styles = styles;

    @property({ type: String, attribute: 'cesium-base-url' })
    cesiumBaseURL = '';

    @property({ type: String, attribute: 'ion-token' })
    ionToken = '';

    @property({ type: String, attribute: 'data-terrain' }) // New
    dataTerrain = '';

    @property({ type: Array, attribute: 'data-tileset', converter: {
            fromAttribute: (value: any) => {
                try {
                    return new Map(JSON.parse(value));
                } catch {
                    return new Map();
                }
            },
        }})
    tilesetUrl:  Map<string, { url: string; icon: string | undefined, description: string | undefined, tileset?: Cesium3DTileset  }> = new Map();



    @property({ type: Object, converter: {
            fromAttribute: (value:any) => {
                try {
                    return new Map(JSON.parse(value));
                } catch {
                    return new Map();
                }
            },
        }})
    data: Map<string, { url: string; contour: boolean, icon: string | undefined, description: string | undefined, dataSource:DataSource | undefined  }> = new Map();

    private _viewer: Viewer | undefined;

    constructor() {
        super();
    }

    override render() {
        return html`
      <div id="cesiumContainer">
      </div>
      <div id="buttonContainer">
          <h2 class="groupTitle">Layers</h2>
          ${Array.from(this.tilesetUrl.entries()).map(
                  ([key, value]) => html`
                      <button
                              class="toggleButton"
                              @click="${() => this.toggleTilesetVisibility(key)}"
                      >
                          <div class="buttonContent">
                          ${value.icon ? html`<img class="icon" src="${value.icon}" alt="Icon for ${key}" width="25" height="25">` : ''}
                          ${value.description ? html`<span class="buttonDescription">${value.description}</span>` : ''}
                          </div>    
                      </button>
                  `
          )}
          <h2 class="groupTitle">Data</h2>
          ${Array.from(this.data.entries()).map(
                  ([key, value]) => html`
            <button
              class="toggleButton"
              @click="${() => this.toggleDataVisibility(key)}"
            >
                <div class="buttonContent">
                ${value.icon ? html`<img class="icon" src="${value.icon}" alt="Icon for ${key}" width="25" height="25">` : ''}
                ${value.description ? html`<span class="buttonDescription">${value.description}</span>` : ''}
                </div>
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

    toggleTilesetVisibility(key: string) {
        const tilesetInfo = this.tilesetUrl.get(key);
        console.log(tilesetInfo)
        if (tilesetInfo && tilesetInfo.tileset) {
            tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
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

        if (changedProperties.has('tilesetUrl') && this.tilesetUrl.size > 0) {
            for (const [_, value] of this.tilesetUrl.entries()) {
                if (this._viewer) {
                    console.log(value)
                    value.tileset = addTileset(this._viewer, value.url);
                }
            }
        }

        const apiData = await apiService.getData("area");
        console.log(apiData)

        }
    }

    override async firstUpdated() {
        super.connectedCallback();
        this._viewer = createCesiumViewer(
            this.shadowRoot!.getElementById("cesiumContainer")!,
            this.cesiumBaseURL,
            this.dataTerrain,
        );
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
