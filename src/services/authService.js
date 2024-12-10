// authService.js
import axios from 'axios';

// Pastikan baseURL adalah URL server Laravel
axios.defaults.baseURL = 'http://127.0.0.1:8000/';

export async function logout() {
    try {
        await axios.post('/logout'); // Pastikan CSRF token sudah tersedia
    } catch (error) {
        console.error('Logout failed:', error);
    }
}
