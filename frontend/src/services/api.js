import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadContract = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeContract = async (contractId) => {
    const response = await api.post(`/analyze/${contractId}`);
    return response.data;
};

export const getContracts = async () => {
    const response = await api.get('/contracts');
    return response.data;
};

export const getContract = async (contractId) => {
    const response = await api.get(`/contracts/${contractId}`);
    return response.data;
};

export const askQuestion = async (contractId, question) => {
    const response = await api.post(`/ask/${contractId}`, { question });
    return response.data;
};

// No changes needed as GlobalChat calls api.post('/ask/global') directly
export const deleteContract = async (contractId) => {
    const response = await api.delete(`/contracts/${contractId}`);
    return response.data;
};

export const compareContracts = async (id1, id2) => {
    const response = await api.post('/compare', { contract_id_1: id1, contract_id_2: id2 });
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
};

export const rewriteClause = async (clauseText, instruction) => {
    const response = await api.post('/rewrite', { clause_text: clauseText, instruction });
    return response.data;
};

export default api;
