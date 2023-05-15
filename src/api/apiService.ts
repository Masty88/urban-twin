import axios from 'axios';

class ApiService {
    private baseURL: string;

    constructor() {
        // Set base URL
        this.baseURL = 'http://localhost:8000/';
    }

    async getData(endpoint: string) {
        try {
            const response = await axios.get(`${this.baseURL}/${endpoint}`);
            return response.data;
        } catch (error) {
            // Manage error
            console.error('Errore nella richiesta GET:', error);
            throw error;
        }
    }

    async postData(endpoint: string, data: any) {
        try {
            const response = await axios.post(`${this.baseURL}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            // Manage Post error
            console.error('Errore nella richiesta POST:', error);
            throw error;
        }
    }

}

const apiService = new ApiService();

export default apiService;
