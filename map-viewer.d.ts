import { LitElement } from 'lit';
import { Cesium3DTileset, DataSource } from "cesium";
export declare class MapViewer extends LitElement {
    static styles: import("lit").CSSResult;
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
    }>;
    private _viewer;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    toggleDataVisibility(key: string): void;
    toggleTilesetVisibility(key: string): void;
    updated(changedProperties: Map<string, unknown>): Promise<void>;
    firstUpdated(): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
//# sourceMappingURL=map-viewer.d.ts.map