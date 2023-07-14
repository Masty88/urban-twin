var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './composants/DataLoader.js';
import './composants/toggle-data.js';
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
        this.tilesetUrl = new Map();
        this.data = new Map();
        this.forestCover = "";
        this.areaForestCover = "";
        this.currentTreeCount = 0;
        this.urbanTree = "";
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
          <div id="dataTreeContainer">
              <p class="dataTitle">Number of urban tree</p>
              <div class="dataSurface count">
                  <svg fill="#CBC118" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 489.8 489.8" xml:space="preserve">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier"> <g> 
                          <g> <path d="M118.8,0.05C36.5,0.05,0,244.95,0,279.35c0,58.5,42.3,108,98,118v50.8H75c-11.5,0-20.8,9.4-20.8,20.8s9.4,20.8,20.8,20.8 h88.6c10.4,0,20.8-9.4,20.8-20.8s-9.4-20.8-20.8-20.8h-24v-50.8c55.9-10,98.9-59.4,98-118C237.6,244.95,201.1,0.05,118.8,0.05z M197,278.35c0,43.8-35.4,79.2-78.2,79.2c-42.7,0-78.2-35.4-78.2-79.2c0-70.9,50-237.6,78.2-237.6S198,207.45,197,278.35z"></path> <path d="M489.8,325.25c0-29.2-28.1-215.7-94.8-215.7s-94.8,186.6-94.8,215.7c0,45.9,31.8,83.9,74,93.5v29.4h-12.5 c-11.5,0-20.8,9.4-20.8,20.8s9.4,20.8,20.8,20.8h66.7c11.5,0,20.8-9.4,20.8-20.8s-9.4-20.8-20.8-20.8h-12.5v-29.4 C458,409.15,489.8,371.05,489.8,325.25z M340.8,326.25c0-49,33.4-164.7,54.2-175.1c20.8,10.4,54.2,126.1,54.2,175.1 c0,30.2-24,55.2-54.2,55.2S340.8,356.45,340.8,326.25z"></path> 
                          </g> </g> </g>
                  </svg>
                  <div class="counter" data-target=${this.urbanTree}>${this.currentTreeCount}</div>
              </div>
          </div>
          <div id="dataC02Container">
              <p class="dataTitle">C0<sup>2</sup> absorbed per year </p>
              <div class="dataSurface count">
                  <svg fill="#CBC118" version="1.1" id="Smoke" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve" stroke="#CBC118"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M220.37,102.96c1.66-4.58,2.5-9.39,2.5-14.34c0-23.29-18.95-42.24-42.24-42.24c-2.36,0-4.71,0.19-7.01,0.58 c-5.67-13.22-16.76-23.52-30.54-28.11C116.59,10.02,87.85,24.39,79,50.9c-0.06,0.16-0.11,0.33-0.17,0.49 c-7.15,2.98-12.97,8.1-16.84,14.46C46.56,63,30.46,68.32,19.83,80.13c-8.14,9.04-12.28,20.71-11.64,32.85 c0.63,12.14,5.96,23.31,14.99,31.45c2.91,2.62,6.09,4.83,9.5,6.6c-2.21,8.11-1.14,16.84,3.16,24.28 c4.26,7.37,11.13,12.65,19.35,14.85c2.75,0.74,5.54,1.1,8.31,1.1c5.52,0,10.97-1.45,15.88-4.28c3.85-2.23,7.22-5.3,9.88-8.98H137 c3.31,0,6-2.69,6-6s-2.69-6-6-6H86c-2.16,0-4.15,1.16-5.21,3.03c-1.8,3.15-4.43,5.83-7.41,7.56c-4.6,2.65-9.95,3.35-15.08,1.98 s-9.41-4.66-12.07-9.26c-3.34-5.79-3.545-12.817-0.56-18.81c0.872-1.75,0.927-3.81,0.247-5.25c-0.68-1.45-2.097-2.55-3.597-3.09 c-4.1-1.46-7.83-3.69-11.1-6.64c-6.66-6-10.58-14.22-11.05-23.17c-0.47-8.94,2.58-17.53,8.58-24.19c7.3-8.1,18.1-12.04,28.73-10.83 c-0.48,2.36-0.75,4.8-0.75,7.29c0,17.5,12.31,32.05,28.93,35.33C86.54,136.94,99.99,150,117,150h45c12.17,0,22.06,9.89,22.06,22.04 V178h12v-5.96c0-18.77-15.28-34.04-34.06-34.04h-45c-10.87,0-19.39-8.71-19.39-19.83v-3.55c0-3.23-2.55-5.88-5.77-6 c-12.96-0.48-23.11-11.02-23.11-24c0-10.55,6.76-19.76,16.82-22.91c1.99-0.63,3.51-2.24,4.02-4.26c0.22-0.88,0.5-1.82,0.82-2.77 c6.75-20.22,28.68-31.18,48.9-24.44c11.89,3.96,21.16,13.49,24.78,25.51c0.46,1.54,1.52,2.82,2.93,3.57 c1.42,0.75,3.08,0.91,4.61,0.42c2.89-0.9,5.93-1.36,9.02-1.36c16.68,0,30.24,13.56,30.24,30.24c0,2.78-0.37,5.5-1.1,8.12 c-4.54-1.79-9.49-2.77-14.7-2.77h-5.67c-5.54-14.74-21.4-23.38-37.09-19.53c-6.82,1.69-12.73,5.47-17.09,10.94 c-2.06,2.59-1.63,6.37,0.96,8.43c2.59,2.07,6.37,1.64,8.43-0.95c2.69-3.38,6.35-5.72,10.58-6.77 c10.48-2.57,21.132,3.852,23.67,14.35c0.921,3.81,3.328,5.53,6.2,5.53h10.01c16.22,0,28.93,13.63,28.93,31.03v41h12v-41 C236,123,229.94,110.77,220.37,102.96z M172.044,188.062L248,188v26h-12v24h-52v-24h-12L172.044,188.062z"></path> </g></svg>
                  <div class="counter" data-target=${this.urbanTree}>${this.currentTreeCount * 22} Kg</div>
              </div>
          </div>
      </div>
      
      <div id="buttonContainer">
          
          <h2 class="groupTitle">Layers</h2>
          ${Array.from(this.tilesetUrl.entries()).map(([key, value]) => html `
                      <toggle-data
                              .key=${key}
                              .value=${value}
                              .clickFunction=${() => this.toggleTilesetVisibility(key)}
                      ></toggle-data>
                  `)}
          
          <h2 class="groupTitle">Data</h2>
          ${Array.from(this.data.entries()).map(([key, value]) => html `
                      <toggle-data
                              .key=${key}
                              .value=${value}
                              .clickFunction=${() => this.toggleDataVisibility(key)}
                      ></toggle-data>
          `)}
          
      </div>
    `;
    }
    toggleDataVisibility(key) {
        const data = this.data.get(key);
        console.log("key is " + key);
        if (data) {
            if (data.dataSource) {
                data.dataSource.show = !data.dataSource.show;
                if (key === 'zone' && this.shadowRoot) {
                    const legend = this.shadowRoot.querySelector('#legend');
                    if (legend) {
                        // Se la dataSource è visibile, mostra la legenda, altrimenti nascondila
                        legend.style.display = data.dataSource.show ? 'flex' : 'none';
                    }
                }
                if (key === 'forest' && this.shadowRoot) {
                    const forestApi = this.shadowRoot.querySelector('#dataContainer');
                    if (forestApi) {
                        // Se la dataSource è visibile, mostra la legenda, altrimenti nascondila
                        forestApi.style.display = data.dataSource.show ? 'flex' : 'none';
                    }
                }
                if (key === 'tree' && this.shadowRoot) {
                    const treeApi = this.shadowRoot.querySelector('#dataTreeContainer');
                    const C02Api = this.shadowRoot.querySelector('#dataC02Container');
                    if (treeApi) {
                        // Se la dataSource è visibile, mostra la legenda, altrimenti nascondila
                        treeApi.style.display = data.dataSource.show ? 'flex' : 'none';
                        C02Api.style.display = data.dataSource.show ? 'flex' : 'none';
                        // Start animation
                        this.animateCounters();
                        if (!data.dataSource.show) {
                            this.currentTreeCount = 0;
                        }
                    }
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
        legendElement.style.display = "none";
        if (this.shadowRoot) {
            // @ts-ignore
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
        this._viewer = createCesiumViewer(this.shadowRoot.getElementById("cesiumContainer"), this.cesiumBaseURL);
        this.forestCover = await apiService.getData("percentage", 'forest');
        this.areaForestCover = await apiService.getData("area", 'forest');
        this.urbanTree = await apiService.getData("trees");
    }
    animateCounters() {
        const speed = 200; // The lower the slower
        const updateCount = () => {
            const target = this.urbanTree;
            const inc = target / speed;
            // @ts-ignore
            if (this.currentTreeCount < target) {
                this.currentTreeCount += Math.round(inc);
                setTimeout(updateCount, 1);
            }
            else {
                this.currentTreeCount = target;
            }
        };
        updateCount();
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
__decorate([
    property({ type: Number })
], MapViewer.prototype, "currentTreeCount", void 0);
__decorate([
    property({ type: String })
], MapViewer.prototype, "urbanTree", void 0);
MapViewer = __decorate([
    customElement('map-viewer')
], MapViewer);
export { MapViewer };
//# sourceMappingURL=map-viewer.js.map