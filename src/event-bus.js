// src/event-bus.js
import { reactive } from 'vue';

const defaultUser = {
  name: 'Nama Tidak Tersedia',
  image: 'https://i.imgur.com/0r41Fnl.jpg'
};

const state = reactive({
  user: getUserFromLocalStorage() || defaultUser
});

function getUserFromLocalStorage() {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
}

export const EventBus = {
  get state() {
    return state;
  },
  setUser(user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
};
