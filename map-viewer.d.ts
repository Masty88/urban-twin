import { LitElement } from 'lit';
import { DataSource } from "cesium";
export declare class MapViewer extends LitElement {
    static styles: import("lit").CSSResult;
    cesiumBaseURL: string;
    ionToken: string;
    data: Map<string, {
        url: string;
        contour: boolean;
        icon: string | undefined;
        dataSource: DataSource | undefined;
    }>;
    private _viewer;
    render(): import("lit-html").TemplateResult<1>;
    toggleDataVisibility(key: string): void;
    updated(changedProperties: Map<string, unknown>): Promise<void>;
    firstUpdated(): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
//# sourceMappingURL=map-viewer.d.ts.map