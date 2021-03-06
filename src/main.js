import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VCalendar from 'v-calendar';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VCalendar, { componentPrefix: 'vc' });
Vue.use(Vuex);
Vue.component('Loading', Loading);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
