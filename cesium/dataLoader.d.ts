import { Color, DataSource } from "cesium";
declare const legend: Map<string, Color>;
export declare function addData(viewer: any, data: string, contour: boolean, colorize: string | undefined): Promise<DataSource | undefined>;
export declare function addTileset(viewer: any, url: string): any;
export declare function drawContour(viewer: any, dataSource: DataSource): void;
export { legend };
//# sourceMappingURL=dataLoader.d.ts.map