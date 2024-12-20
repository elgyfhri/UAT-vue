// authService.js
import axios from 'axios';

// Pastikan baseURL adalah URL server Laravel
axios.defaults.baseURL = 'https://pklwikrama1.4vmapps.com/';

export async function logout() {
    try {
        await axios.post('/logout'); // Pastikan CSRF token sudah tersedia
    } catch (error) {
        console.error('Logout failed:', error);
    }
}
