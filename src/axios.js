import axios from 'axios';

export const logout = async () => {
  try {
    await axios.post('/logout');
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
