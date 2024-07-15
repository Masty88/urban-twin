declare class ApiService {
    private baseURL;
    constructor();
    getData(endpoint: string, optionalParam?: string): Promise<any>;
    postData(endpoint: string, data: any): Promise<any>;
}
declare const apiService: ApiService;
export default apiService;
//# sourceMappingURL=apiService.d.ts.map