import { LitElement, html} from 'lit';
import {styles} from "./styles/styles";
import { customElement, property } from 'lit/decorators.js';
import './components/data-container';
import './components/layer-container';
import './components/button-container';
import { createCesiumViewer, zoomToDataSource } from './cesium/cesiumHelpers';
import { addData, addTileset } from './cesium/dataLoader';
import { Cesium3DTileset, DataSource, Viewer } from 'cesium';
import apiService from './api/apiService';

@customElement('map-viewer')
export class MapViewer extends LitElement {
    static override styles = styles

    @property({ type: String, attribute: 'cesium-base-url' })
    cesiumBaseURL = '';

    @property({ type: String, attribute: 'ion-token' })
    ionToken = '';

    @property({ type: String, attribute: 'data-terrain' })
    dataTerrain = '';

    @property({ type: Array, attribute: 'data-tileset' })
    tilesetUrl: Array<{
        key: string;
        url: string;
        icon?: string;
        description?: string;
        tileset?: Cesium3DTileset;
    }> = [];

    @property({ type: Array, attribute: 'data' })
    data: Array<{
        key: string;
        url: string;
        contour: boolean;
        icon?: string;
        description?: string;
        dataSource?: DataSource;
    }> = [];

    private _viewer: Viewer | undefined;

    override render() {
        return html`
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

    override async updated(changedProperties: Map<string, unknown>) {
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

    override async firstUpdated() {
        super.connectedCallback();
        this._viewer = createCesiumViewer(
            this.shadowRoot!.getElementById('cesiumContainer')!,
            this.cesiumBaseURL,
            this.dataTerrain
        );
    }

    toggleDataVisibility(event: CustomEvent) {
        const key = event.detail.key;
        const data = this.data.find(item => item.key === key);
        if (data && data.dataSource) {
            data.dataSource.show = !data.dataSource.show;
        }
    }

    toggleTilesetVisibility(event: CustomEvent) {
            const key = event.detail.key;
            const tilesetInfo = this.tilesetUrl.find(item => item.key === key);
            if (tilesetInfo && tilesetInfo.tileset) {
                tilesetInfo.tileset.show = !tilesetInfo.tileset.show;
            }
        }
    }




declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}



