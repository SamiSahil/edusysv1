// src/apiService.js

import { showToast } from './utils/helpers.js';

// Helper to get the auth token from session storage and build headers
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('sms_auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Global handler for API responses to centrally manage errors and auth failures
const handleApiResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('sms_user_pro');
        sessionStorage.removeItem('sms_auth_token');
        showToast('Session expired. Please log in again.', 'error');
        setTimeout(() => window.location.reload(), 1500);
        throw new Error('Authentication failed');
    }

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || `An unknown server error occurred.`);
    }
    
    return responseData;
};

export const apiService = (() => {
    const API_BASE_URL = 'http://localhost:4051/api';
    const financialCollections = new Set(['fees', 'salaries', 'expenses']);

    const getBaseUrlForCollection = (collection) => {
        return financialCollections.has(collection)
            ? `${API_BASE_URL}/financial/${collection}`
            : `${API_BASE_URL}/${collection}`;
    };

    const mapId = (item) => {
        if (item && item._id) item.id = item._id.toString();
        return item;
    };
    const mapIdInArray = (arr) => Array.isArray(arr) ? arr.map(mapId) : [];

    const get = async (collection, subCollection = null) => {
        const url = subCollection ? `${getBaseUrlForCollection(collection)}/${subCollection}` : getBaseUrlForCollection(collection);
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            const data = await handleApiResponse(response);
            return Array.isArray(data) ? mapIdInArray(data) : mapId(data);
        } catch (error) {
            console.error(`Failed to GET from ${url}:`, error.message);
            return []; 
        }
    };

    const performMutation = async (url, method, data) => {
        try {
            const isFormData = data instanceof FormData;
            const baseHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };
            const authHeaders = getAuthHeaders();

            const response = await fetch(url, {
                method,
                headers: { ...baseHeaders, ...authHeaders },
                body: isFormData ? data : JSON.stringify(data),
            });

            const responseData = await handleApiResponse(response);
            return mapId(responseData);
        } catch (error) {
            console.error(`Failed ${method} to ${url}:`, error.message);
            showToast(`Error: ${error.message}`, 'error');
            return null;
        }
    };
    
    // All mutation functions now use the secure wrapper
    const create = (collection, data, subCollection = null) => {
        const url = subCollection ? `${getBaseUrlForCollection(collection)}/${subCollection}` : getBaseUrlForCollection(collection);
        return performMutation(url, 'POST', data);
    };

    const update = (collection, id, data, subCollection = null) => {
        const url = subCollection ? `${getBaseUrlForCollection(collection)}/${subCollection}/${id}` : `${getBaseUrlForCollection(collection)}/${id}`;
        return performMutation(url, 'PUT', data);
    };
    
    const remove = async (collection, id, subCollection = null) => {
        const url = subCollection ? `${getBaseUrlForCollection(collection)}/${subCollection}/${id}` : `${getBaseUrlForCollection(collection)}/${id}`;
        try {
            const response = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() });
            return await handleApiResponse(response);
        } catch (error) {
             showToast(`Error: ${error.message}`, 'error');
             return { success: false };
        }
    };

    const bulkCreate = (collection, data) => performMutation(`${getBaseUrlForCollection(collection)}/bulk`, 'POST', data);
    const bulkRemove = (collection, ids) => performMutation(`${getBaseUrlForCollection(collection)}/bulk`, 'DELETE', { ids });
    const saveAttendance = (data) => performMutation(`${API_BASE_URL}/attendance`, 'POST', data);
    const reactToNotice = (noticeId, reactionType) => {
        const data = { userId: JSON.parse(sessionStorage.getItem('sms_user_pro')).id, reactionType };
        return performMutation(`${API_BASE_URL}/notices/${noticeId}/react`, 'POST', data);
    };

    // Special GET requests that don't need mutations
    const getAttendance = async (sectionId, date) => {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance/${sectionId}/${date}`, { headers: getAuthHeaders() });
            return await handleApiResponse(response);
        } catch (error) { return {}; }
    };
    const getAttendanceReport = async (type, id, params) => {
        const url = new URL(`${API_BASE_URL}/attendance/report/${type}/${id}`);
        if (params) url.search = new URLSearchParams(params).toString();
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            return await handleApiResponse(response);
        } catch (error) { return []; }
    };

    return { get, create, update, remove, bulkCreate, bulkRemove, saveAttendance, getAttendance, getAttendanceReport, reactToNotice };
})();