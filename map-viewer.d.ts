import { LitElement } from 'lit';
import './components/data-container';
import './components/layer-container';
import './components/button-container';
import { Cesium3DTileset, DataSource } from 'cesium';
export declare class MapViewer extends LitElement {
    static styles: import("lit").CSSResult;
    cesiumBaseURL: string;
    ionToken: string;
    dataTerrain: string;
    tilesetUrl: Array<{
        key: string;
        url: string;
        icon?: string;
        description?: string;
        tileset?: Cesium3DTileset;
    }>;
    data: Array<{
        key: string;
        url: string;
        contour: boolean;
        icon?: string;
        description?: string;
        dataSource?: DataSource;
    }>;
    private _viewer;
    render(): import("lit-html").TemplateResult<1>;
    updated(changedProperties: Map<string, unknown>): Promise<void>;
    firstUpdated(): Promise<void>;
    toggleDataVisibility(event: CustomEvent): void;
    toggleTilesetVisibility(event: CustomEvent): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
//# sourceMappingURL=map-viewer.d.ts.map