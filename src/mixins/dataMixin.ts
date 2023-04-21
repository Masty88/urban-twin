import { LitElement } from 'lit';
import {Color, DataSource, Entity, GeoJsonDataSource, JulianDate} from 'cesium';
import { property } from 'lit/decorators.js';

type Constructor<T = {}> = new (...args: any[]) => T;


export const CesiumDataSourceMixin = <T extends Constructor<LitElement>>(SuperClass: T) => {
    class CesiumDataSourceMixinClass extends SuperClass {
        @property({ type: Object })
        dataSources: Record<string, GeoJsonDataSource> = {};

        async addData(data: string, clamp: boolean) {
            console.log('Loading data:', data);
            try {
                const dataSource = await GeoJsonDataSource.load(data);
                const propertyName = `${dataSource.name}DataSource`;
                this.dataSources = { ...this.dataSources, [propertyName]: dataSource };
                (this as any)._viewer?.dataSources.add(dataSource);
                clamp && this.clampPolygonsToGround(dataSource);
                this.requestUpdate();
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        /**
         * Adds polylines to the Cesium viewer that are clamped to the ground and based on the polygons in the given data source.
         * Removes the original polygons from the data source.
         * @param dataSource The data source containing the polygons to use as the basis for the polylines.
         */
        private clampPolygonsToGround(dataSource : DataSource){
            const entities = dataSource.entities.values;
            entities.forEach((e: Entity)=>{
                if (e.polygon?.hierarchy){
                    (this as any)._viewer?.entities.add({
                        polyline:{
                            positions: e.polygon.hierarchy.getValue(JulianDate.now()).positions,
                            width: 3,
                            material: Color.YELLOW.withAlpha(0.5),
                            clampToGround: true
                        }
                    });
                    dataSource.entities.remove(e);
                }
            })
        }

    };
    return CesiumDataSourceMixinClass as T;
};
