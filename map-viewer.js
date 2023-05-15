var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createCesiumViewer, zoomToDataSource } from "./cesium/cesiumHelpers";
import { addData, addTileset } from './cesium/dataLoader';
import { styles } from "./styles/styles";
import apiService from './api/apiService';
let MapViewer = class MapViewer extends LitElement {
    constructor() {
        super();
        this.cesiumBaseURL = '';
        this.ionToken = '';
        this.dataTerrain = '';
        this.tilesetUrl = new Map();
        this.data = new Map();
    }
    render() {
        return html `
      <div id="cesiumContainer">
      </div>
      <div id="buttonContainer">
          <h2 class="groupTitle">Layers</h2>
          ${Array.from(this.tilesetUrl.entries()).map(([key, value]) => html `
                      <button
                              class="toggleButton"
                              @click="${() => this.toggleTilesetVisibility(key)}"
                      >
                          <div class="buttonContent">
                          ${value.icon ? html `<img class="icon" src="${value.icon}" alt="Icon for ${key}" width="25" height="25">` : ''}
                          ${value.description ? html `<span class="buttonDescription">${value.description}</span>` : ''}
                          </div>    
                      </button>
                  `)}
          <h2 class="groupTitle">Data</h2>
          ${Array.from(this.data.entries()).map(([key, value]) => html `
            <button
              class="toggleButton"
              @click="${() => this.toggleDataVisibility(key)}"
            >
                <div class="buttonContent">
                ${value.icon ? html `<img class="icon" src="${value.icon}" alt="Icon for ${key}" width="25" height="25">` : ''}
                ${value.description ? html `<span class="buttonDescription">${value.description}</span>` : ''}
                </div>
            </button>
          `)}
      </div>
    `;
    }
    toggleDataVisibility(key) {
        const data = this.data.get(key);
        console.log("key is " + key);
        if (data && data.dataSource) {
            data.dataSource.show = !data.dataSource.show;
        }
    }
    toggleTilesetVisibility(key) {
        const tilesetInfo = this.tilesetUrl.get(key);
        console.log(tilesetInfo);
        if (tilesetInfo && tilesetInfo.tileset) {
            tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
        }
    }
    async updated(changedProperties) {
        console.log("updated");
        if (changedProperties.has('data') && this.data.size > 0) {
            for (const [_, value] of this.data.entries()) {
                console.log(value);
                const dataSource = await addData(this._viewer, value.url, value.contour);
                await zoomToDataSource(this._viewer, dataSource);
                value.dataSource = dataSource;
            }
            if (changedProperties.has('tilesetUrl') && this.tilesetUrl.size > 0) {
                for (const [_, value] of this.tilesetUrl.entries()) {
                    if (this._viewer) {
                        console.log(value);
                        value.tileset = addTileset(this._viewer, value.url);
                    }
                }
            }
            const apiData = await apiService.getData("area");
            console.log(apiData);
        }
    }
    async firstUpdated() {
        super.connectedCallback();
        this._viewer = createCesiumViewer(this.shadowRoot.getElementById("cesiumContainer"), this.cesiumBaseURL, this.dataTerrain);
    }
};
MapViewer.styles = styles;
__decorate([
    property({ type: String, attribute: 'cesium-base-url' })
], MapViewer.prototype, "cesiumBaseURL", void 0);
__decorate([
    property({ type: String, attribute: 'ion-token' })
], MapViewer.prototype, "ionToken", void 0);
__decorate([
    property({ type: String, attribute: 'data-terrain' }) // New
], MapViewer.prototype, "dataTerrain", void 0);
__decorate([
    property({ type: Array, attribute: 'data-tileset', converter: {
            fromAttribute: (value) => {
                try {
                    return new Map(JSON.parse(value));
                }
                catch {
                    return new Map();
                }
            },
        } })
], MapViewer.prototype, "tilesetUrl", void 0);
__decorate([
    property({ type: Object, converter: {
            fromAttribute: (value) => {
                try {
                    return new Map(JSON.parse(value));
                }
                catch {
                    return new Map();
                }
            },
        } })
], MapViewer.prototype, "data", void 0);
MapViewer = __decorate([
    customElement('map-viewer')
], MapViewer);
export { MapViewer };
//# sourceMappingURL=map-viewer.js.map