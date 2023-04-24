import { LitElement } from 'lit';
export declare class MapViewer extends LitElement {
    static styles: import("lit").CSSResult;
    cesiumBaseURL: string;
    ionToken: string;
    data: Map<string, {
        url: string;
        clamp: boolean;
    }>;
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
//# sourceMappingURL=map-viewer.d.ts.map