import { createRouter, createWebHistory } from 'vue-router';
import LyricsList from '../components/LyricsList.vue';
import LyricsDetail from '../components/LyricsDetail.vue';
import UserLogin from '../components/Login.vue';
import AdminPanel from '../components/Admin.vue';

const routes = [
  { path: '/', component: LyricsList },
  { path: '/lyrics', component: LyricsList },
  { path: '/lyrics/:id', component: LyricsDetail },
  { path: '/login', component: UserLogin },
  { path: '/admin', component: AdminPanel, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn');
  if (to.path === '/login' && loggedIn) {
    next('/admin');
  } else if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;