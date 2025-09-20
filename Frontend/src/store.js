// src/store.js

import { apiService } from './apiService.js';

export const store = {
    _data: {},
    _maps: {},

    /**
     * Initializes the store to an empty state. 
     * This function no longer fetches any data on startup.
     */
    async initialize() {
        this._data = {};
        this._maps = {};
        console.log("Client-side store initialized (no data fetched).");
    },

    /**
     * Gets a collection from the local cache.
     * Returns an empty array if the collection is not found.
     */
    get(collection, subCollection = null) {
        if (subCollection) {
            return this._data[collection]?.[subCollection] ?? [];
        }
        return this._data[collection] ?? [];
    },

    /**
     * Gets a pre-built Map for a collection for fast lookups by ID.
     */
    getMap(mapName) {
        return this._maps[mapName] || new Map();
    },

    /**
     * Rebuilds the fast-access Maps from the currently cached data.
     * This should be called after any refresh operation.
     */
    buildMaps() {
        this._maps.students = new Map(this.get('students').map(s => [s.id, s]));
        this._maps.teachers = new Map(this.get('teachers').map(t => [t.id, t]));
        this._maps.sections = new Map(this.get('sections').map(s => [s.id, s]));
        this._maps.subjects = new Map(this.get('subjects').map(s => [s.id, s]));
        this._maps.departments = new Map(this.get('departments').map(d => [d.id, d]));
        this._maps.users = new Map(this.get('users').map(u => [u.id, u]));
        this._maps.books = new Map(this.get('library', 'books').map(b => [b.bookId, b]));
    },

    /**
     * This is now the ONLY function for fetching data. It gets fresh data from the API, 
     * updates the cache, and rebuilds the maps.
     * @returns {Promise<Array|Object>} The freshly fetched data.
     */
    async refresh(collection, subCollection = null) {
        console.log(`Refreshing data for: ${collection}${subCollection ? `.${subCollection}` : ''}`);
        try {
            const data = await apiService.get(collection, subCollection);
            
            if (subCollection) {
                this._data[collection] = this._data[collection] || {};
                this._data[collection][subCollection] = data;
            } else {
                this._data[collection] = data;
            }
            
            this.buildMaps(); // Always rebuild maps after a successful fetch
            return data;
        } catch (error) {
            console.error(`Failed to refresh collection '${collection}':`, error);
            // Ensure the key exists as an empty array to prevent crashes elsewhere
            if (subCollection) {
                this._data[collection] = this._data[collection] || {};
                this._data[collection][subCollection] = [];
            } else {
                this._data[collection] = [];
            }
            return []; // Return empty array on failure
        }
    }
};