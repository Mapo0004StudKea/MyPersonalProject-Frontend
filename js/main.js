// main.js

import { loadHome } from './home.js';
import { loadAnime } from './anime.js';
import { loadAdmin } from './admin.js';


// Function to parse hash and extract route and query parameters
function parseHash(hash) {
    const [route, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString);
    return { route, params };
}

// Function to handle navigation
function navigate() {
    const hash = window.location.hash.substring(1) || 'home';
    const { route, params } = parseHash(hash);

    switch (route) {
        case 'home':
            loadHome();
            break;
        case 'anime' :
            loadAnime();
            break;
        case 'admin':
            loadAdmin();
            break;
        default:
            loadHome();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navigate(); // Load the initial route
    window.addEventListener('hashchange', navigate); // Listen for hash changes
});


