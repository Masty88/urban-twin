var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createWorldTerrain, createOsmBuildings, Viewer } from 'cesium';
import { styles } from "./styles/styles";
import { CesiumDataSourceMixin } from "./mixins/dataMixin";
let MapViewer = class MapViewer extends CesiumDataSourceMixin(LitElement) {
    constructor() {
        super(...arguments);
        this.cesiumBaseURL = '';
        this.ionToken = '';
        this.data = new Map();
    }
    render() {
        return html `
      <div id="cesiumContainer">
      </div>
    `;
    }
    async updated(changedProperties) {
        if (changedProperties.has('data') && this.data.size > 0) {
            for (const [key, value] of this.data.entries()) {
                await this.addData(value.url, value.clamp);
            }
        }
    }
    async firstUpdated() {
        var _a;
        super.connectedCallback();
        if (this.cesiumBaseURL) {
            window.CESIUM_BASE_URL = this.cesiumBaseURL;
        }
        this._viewer = new Viewer(this.shadowRoot.getElementById('cesiumContainer'), {
            animation: false,
            homeButton: false,
            baseLayerPicker: false,
            geocoder: false,
            infoBox: true,
            sceneModePicker: true,
            selectionIndicator: false,
            timeline: false,
            navigationInstructionsInitiallyVisible: false,
            navigationHelpButton: false,
            shadows: true,
            terrainProvider: createWorldTerrain()
        });
        (_a = this._viewer) === null || _a === void 0 ? void 0 : _a.scene.primitives.add(createOsmBuildings());
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
    property({ type: Object, converter: {
            fromAttribute: (value) => {
                try {
                    return new Map(JSON.parse(value));
                }
                catch {
                    return new Map();
                }
            },
        } })
], MapViewer.prototype, "data", void 0);
MapViewer = __decorate([
    customElement('map-viewer')
], MapViewer);
export { MapViewer };
//# sourceMappingURL=map-viewer.js.map