import axios from 'axios';

class ApiService {
    private baseURL: string;

    constructor() {
        // Imposta l'URL di base per le tue chiamate API
        this.baseURL = 'http://localhost:8000/';
    }

    async getData(endpoint: string) {
        try {
            const response = await axios.get(`${this.baseURL}/${endpoint}`);
            return response.data;
        } catch (error) {
            // Gestisci gli errori delle chiamate API
            console.error('Errore nella richiesta GET:', error);
            throw error;
        }
    }

    async postData(endpoint: string, data: any) {
        try {
            const response = await axios.post(`${this.baseURL}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            // Gestisci gli errori delle chiamate API
            console.error('Errore nella richiesta POST:', error);
            throw error;
        }
    }

}

// Crea un'istanza del servizio API per l'utilizzo nell'applicazione
const apiService = new ApiService();

export default apiService;
