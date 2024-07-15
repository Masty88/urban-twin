"use strict";
// import {LitElement, html} from 'lit';
// import { customElement, property } from 'lit/decorators.js';
//
// import {zoomToDataSource} from "../cesium/cesiumHelpers";
// import {addData} from '../cesium/dataLoader';
// import {DataSource, Viewer} from "cesium";
//
// @customElement('data-loader')
// export class DataLoader extends LitElement {
//
//     @property({ type: Object })
//     data: { url: string; contour: boolean, icon: string | undefined, description: string | undefined} = {url: "", contour: false, icon: undefined, description: undefined};
//
//     @property({ type: Object })
//     viewer: Viewer | undefined;
//
//
//     constructor() {
//         super();
//         console.log("data-loader created")
//     }
//
//     override async updated(changedProperties: Map<string, unknown>) {
//         console.log("data-loader updated")
//         if (changedProperties.has('data') && this.data.url !== "") {
//             console.log(this.data)
//             const dataSource = await addData(this.viewer, this.data.url, this.data.contour);
//             await zoomToDataSource(this.viewer, dataSource)
//             this.data.dataSource = dataSource;
//         }
//     }
//
//     override render() {
//         return html``; // o qualcosa di visibile se preferisci
//     }
// }
//# sourceMappingURL=DataLoader.js.map