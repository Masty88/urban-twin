var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { styles } from "./styles/styles";
import { customElement, property } from 'lit/decorators.js';
import './components/data-container';
import './components/layer-container';
import './components/button-container';
import { createCesiumViewer, zoomToDataSource } from './cesium/cesiumHelpers';
import { addData, addTileset } from './cesium/dataLoader';
import apiService from './api/apiService';
let MapViewer = class MapViewer extends LitElement {
    constructor() {
        super(...arguments);
        this.cesiumBaseURL = '';
        this.ionToken = '';
        this.dataTerrain = '';
        this.tilesetUrl = [];
        this.data = [];
    }
    render() {
        return html `
      <div id="cesiumContainer"></div>
      <data-container .data=${this.data}></data-container>
      <layer-container .tilesetUrl=${this.tilesetUrl}></layer-container>
      <button-container
        .data=${this.data}
        .tilesetUrl=${this.tilesetUrl}
        @toggle-data=${this.toggleDataVisibility}
        @toggle-tileset=${this.toggleTilesetVisibility}
      ></button-container>
    `;
    }
    async updated(changedProperties) {
        if (changedProperties.has('data') && this.data.length > 0) {
            for (const value of this.data) {
                const dataSource = await addData(this._viewer, value.url, value.contour);
                await zoomToDataSource(this._viewer, dataSource);
                value.dataSource = dataSource;
            }
        }
        if (changedProperties.has('tilesetUrl') && this.tilesetUrl.length > 0) {
            for (const value of this.tilesetUrl) {
                if (this._viewer) {
                    value.tileset = addTileset(this._viewer, value.url);
                }
            }
        }
        const apiData = await apiService.getData('area');
        console.log(apiData);
    }
    async firstUpdated() {
        super.connectedCallback();
        this._viewer = createCesiumViewer(this.shadowRoot.getElementById('cesiumContainer'), this.cesiumBaseURL, this.dataTerrain);
    }
    toggleDataVisibility(event) {
        const key = event.detail.key;
        const data = this.data.find(item => item.key === key);
        if (data && data.dataSource) {
            data.dataSource.show = !data.dataSource.show;
        }
    }
    toggleTilesetVisibility(event) {
        const key = event.detail.key;
        const tilesetInfo = this.tilesetUrl.find(item => item.key === key);
        if (tilesetInfo && tilesetInfo.tileset) {
            tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
        }
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
    property({ type: String, attribute: 'data-terrain' })
], MapViewer.prototype, "dataTerrain", void 0);
__decorate([
    property({ type: Array, attribute: 'data-tileset' })
], MapViewer.prototype, "tilesetUrl", void 0);
__decorate([
    property({ type: Array, attribute: 'data' })
], MapViewer.prototype, "data", void 0);
MapViewer = __decorate([
    customElement('map-viewer')
], MapViewer);
export { MapViewer };
//# sourceMappingURL=map-viewer.js.map