import { LitElement } from 'lit';
import './composants/DataLoader.js';
import './composants/toggle-data.js';
import { Cesium3DTileset, DataSource } from "cesium";
export declare class MapViewer extends LitElement {
    static styles: import("lit").CSSResult;
    loading: boolean;
    cesiumBaseURL: string;
    ionToken: string;
    dataTerrain: string;
    tilesetUrl: Map<string, {
        url: string;
        icon: string | undefined;
        description: string | undefined;
        tileset?: Cesium3DTileset;
    }>;
    data: Map<string, {
        url: string;
        contour: boolean;
        icon: string | undefined;
        description: string | undefined;
        dataSource: DataSource | undefined;
        colorize: string | undefined;
    }>;
    forestCover: string;
    areaForestCover: string;
    private _viewer;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    toggleDataVisibility(key: string): void;
    toggleTilesetVisibility(key: string): void;
    createLegend(): void;
    updated(changedProperties: Map<string, unknown>): Promise<void>;
    firstUpdated(_changedProperties: Map<string, unknown>): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
//# sourceMappingURL=map-viewer.d.ts.map