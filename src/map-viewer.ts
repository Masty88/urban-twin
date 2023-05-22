import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './composants/DataLoader.js';

import {createCesiumViewer, zoomToDataSource} from "./cesium/cesiumHelpers";
import {addData, addTileset} from './cesium/dataLoader';

import {styles} from "./styles/styles";
import {Cesium3DTileset, DataSource, Viewer} from "cesium";

import apiService from "./api/apiService";

import {legend} from "./cesium/dataLoader";


@customElement('map-viewer')
export class MapViewer extends LitElement{
    static override styles = styles;

    @property({type: Boolean})
    loading = true;

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
    data: Map<string, { url: string; contour: boolean, icon: string | undefined, description: string | undefined, dataSource:DataSource | undefined, colorize: string | undefined   }> = new Map();

    @property({type: String}) forestCover = "";
    @property({type: String}) areaForestCover = "";



    private _viewer: Viewer | undefined;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    override render() {
        return html`
      ${this.loading ? html`<div id="loadingScreen">Loading...</div>` : null}
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
            }
        }
    }

    toggleTilesetVisibility(key: string) {
        const tilesetInfo = this.tilesetUrl.get(key);
        console.log(tilesetInfo)
        if (tilesetInfo && tilesetInfo.tileset) {
            tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
        }
    }

    createLegend() {
        // Create a legend element
        const legendElement = document.createElement('div');
        legendElement.id = 'legend';
        legendElement.style.display = "none"

        if(this.shadowRoot){
            // @ts-ignore
            this.shadowRoot.querySelector("#legendContainer").appendChild(legendElement);  // Append to shadowRoot instead of document.body
        }
        // Populate the legend with color-information
        legend.forEach((color, property) => {
            const item = document.createElement('div');
            item.className = "legend-container"

            const key = document.createElement('div');
            key.className = 'legend-key';
            key.style.backgroundColor = color.toCssColorString();
            key.style.display = 'inline-block';
            key.style.width = '20px';
            key.style.height = '20px';

            const value = document.createElement('p');
            value.className = "legend-value"
            value.innerHTML = property;

            item.appendChild(key);
            item.appendChild(value);
            legendElement.appendChild(item);
        });
    }


    override async updated(changedProperties: Map<string, unknown>) {
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

    override async firstUpdated(_changedProperties: Map<string, unknown>) {
        super.firstUpdated(_changedProperties);
        this._viewer = createCesiumViewer(
            this.shadowRoot!.getElementById("cesiumContainer")!,
            this.cesiumBaseURL,
            this.dataTerrain,
        );

        this.forestCover = await apiService.getData("percentage", 'forest');
        this.areaForestCover = await apiService.getData("area", 'forest');
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
