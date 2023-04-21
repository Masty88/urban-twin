import { LitElement } from 'lit';
declare const MapViewer_base: typeof LitElement;
export declare class MapViewer extends MapViewer_base {
    static styles: import("lit").CSSResult;
    cesiumBaseURL: string;
    ionToken: string;
    data: string;
    clampPolygon: string;
    private _viewer;
    render(): import("lit-html").TemplateResult<1>;
    updated(changedProperties: Map<string, unknown>): Promise<void>;
    firstUpdated(): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'map-viewer': MapViewer;
    }
}
export {};
//# sourceMappingURL=map-viewer.d.ts.map