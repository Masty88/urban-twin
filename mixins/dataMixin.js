var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Color, GeoJsonDataSource, JulianDate } from 'cesium';
import { property } from 'lit/decorators.js';
export const CesiumDataSourceMixin = (SuperClass) => {
    class CesiumDataSourceMixinClass extends SuperClass {
        constructor() {
            super(...arguments);
            this.dataSources = {};
        }
        async addData(data, clamp) {
            var _a;
            console.log(data);
            try {
                const dataSource = await GeoJsonDataSource.load(data);
                const propertyName = `${dataSource.name}DataSource`;
                this.dataSources = { ...this.dataSources, [propertyName]: dataSource };
                (_a = this._viewer) === null || _a === void 0 ? void 0 : _a.dataSources.add(dataSource);
                clamp.includes("clamp") && this.clampPolygonsToGround(dataSource);
                this.requestUpdate();
            }
            catch (error) {
                console.error('Error loading data:', error);
            }
        }
        /**
         * Adds polylines to the Cesium viewer that are clamped to the ground and based on the polygons in the given data source.
         * Removes the original polygons from the data source.
         * @param dataSource The data source containing the polygons to use as the basis for the polylines.
         */
        clampPolygonsToGround(dataSource) {
            const entities = dataSource.entities.values;
            entities.forEach((e) => {
                var _a, _b;
                if ((_a = e.polygon) === null || _a === void 0 ? void 0 : _a.hierarchy) {
                    (_b = this._viewer) === null || _b === void 0 ? void 0 : _b.entities.add({
                        polyline: {
                            positions: e.polygon.hierarchy.getValue(JulianDate.now()).positions,
                            width: 3,
                            material: Color.YELLOW.withAlpha(0.5),
                            clampToGround: true
                        }
                    });
                    dataSource.entities.remove(e);
                }
            });
        }
    }
    __decorate([
        property({ type: Object })
    ], CesiumDataSourceMixinClass.prototype, "dataSources", void 0);
    ;
    return CesiumDataSourceMixinClass;
};
//# sourceMappingURL=dataMixin.js.map