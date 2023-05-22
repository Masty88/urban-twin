var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './composants/DataLoader.js';
import { createCesiumViewer, zoomToDataSource } from "./cesium/cesiumHelpers";
import { addData, addTileset } from './cesium/dataLoader';
import { styles } from "./styles/styles";
import apiService from "./api/apiService";
import { legend } from "./cesium/dataLoader";
let MapViewer = class MapViewer extends LitElement {
    constructor() {
        super();
        this.loading = true;
        this.cesiumBaseURL = '';
        this.ionToken = '';
        this.dataTerrain = '';
        this.tilesetUrl = new Map();
        this.data = new Map();
        this.forestCover = "";
        this.areaForestCover = "";
        this.attachShadow({ mode: 'open' });
    }
    render() {
        return html `
      ${this.loading ? html `<div id="loadingScreen">Loading...</div>` : null}
      <div id="cesiumContainer">
      </div>
      
      <div id="legendContainer">
          <div id="dataContainer">
              <p class="dataTitle">Total forest coverage</p>
              <div class="dataSurface">
                  <div class="single-chart">
                      <svg viewBox="0 0 36 36" class="circular-chart green">
                          <path class="circle-bg"
                                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path class="circle ${this.loading ? '' : 'circle-animate'}"
                                stroke-dasharray="64.4, 100"
                                :style="circleStyle"
                                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" class="percentage">${this.forestCover}</text>
                      </svg>
                  </div>
              </div>
              <p class="dataTitle">${this.areaForestCover} km2</p>
          </div>
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
            if (key === 'zone') {
                const legend = this.shadowRoot.querySelector('#legend');
                if (legend) {
                    // Se la dataSource è visibile, mostra la legenda, altrimenti nascondila
                    legend.style.display = data.dataSource.show ? 'flex' : 'none';
                }
            }
        }
    }
    toggleTilesetVisibility(key) {
        const tilesetInfo = this.tilesetUrl.get(key);
        console.log(tilesetInfo);
        if (tilesetInfo && tilesetInfo.tileset) {
            tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
        }
    }
    createLegend() {
        // Create a legend element
        const legendElement = document.createElement('div');
        legendElement.id = 'legend';
        if (this.shadowRoot) {
            this.shadowRoot.querySelector("#legendContainer").appendChild(legendElement); // Append to shadowRoot instead of document.body
        }
        // Populate the legend with color-information
        legend.forEach((color, property) => {
            const item = document.createElement('div');
            item.className = "legend-container";
            const key = document.createElement('div');
            key.className = 'legend-key';
            key.style.backgroundColor = color.toCssColorString();
            key.style.display = 'inline-block';
            key.style.width = '20px';
            key.style.height = '20px';
            const value = document.createElement('p');
            value.className = "legend-value";
            value.innerHTML = property;
            item.appendChild(key);
            item.appendChild(value);
            legendElement.appendChild(item);
        });
    }
    async updated(changedProperties) {
        if (changedProperties.has('data') && this.data.size > 0) {
            const dataPromises = Array.from(this.data.entries()).map(async ([_, value]) => {
                const dataSource = await addData(this._viewer, value.url, value.contour, value.colorize);
                await zoomToDataSource(this._viewer, dataSource);
                value.dataSource = dataSource;
                // Create the legend
            });
            await Promise.all(dataPromises);
            this.createLegend();
            this.loading = false;
        }
        if (changedProperties.has('tilesetUrl') && this.tilesetUrl.size > 0) {
            const tilesetPromises = Array.from(this.tilesetUrl.entries()).map(async ([_, value]) => {
                if (this._viewer) {
                    value.tileset = addTileset(this._viewer, value.url);
                }
            });
            await Promise.all(tilesetPromises);
        }
    }
    async firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this._viewer = createCesiumViewer(this.shadowRoot.getElementById("cesiumContainer"), this.cesiumBaseURL, this.dataTerrain);
        this.forestCover = await apiService.getData("percentage", 'forest');
        this.areaForestCover = await apiService.getData("area", 'forest');
    }
};
MapViewer.styles = styles;
__decorate([
    property({ type: Boolean })
], MapViewer.prototype, "loading", void 0);
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
__decorate([
    property({ type: String })
], MapViewer.prototype, "forestCover", void 0);
__decorate([
    property({ type: String })
], MapViewer.prototype, "areaForestCover", void 0);
MapViewer = __decorate([
    customElement('map-viewer')
], MapViewer);
export { MapViewer };
//# sourceMappingURL=map-viewer.js.map