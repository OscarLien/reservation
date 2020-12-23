import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: true,
    room: [],
    selectRoom: {
      id: '',
      imageUrl: '',
      normalDayPrice: 0,
      holidayPrice: 0,
      name: '',
    },
    roomDetail: null,
    bookInfo: null,
  },
  actions: {
    UpdateLoading(context, status) {
      context.commit('LOADING', status);
    },
    getRoom(context) {
      const api = `${process.env.VUE_APP_APIPATH}/rooms`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      axios.get(api).then((response) => {
        context.commit('ROOM', response.data.items);
        // this.selectRoom = { ...vm.room[0] };
        context.commit('SELECTROOM', response.data.items[0]);
        context.commit('LOADING', false);
      });
    },
    getDetailRoom(context, id) {
      const api = `${process.env.VUE_APP_APIPATH}/room/${id}`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      axios.get(api).then((response) => {
        const [roomData] = response.data.room;
        context.commit('ROOMDETAIL', roomData);
        context.commit('BOOKINFO', response.data.booking);
        // vm.roomDetail = roomData;
        // vm.bookInfo = response.data.booking;
        context.commit('LOADING', false);
      });
    },
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
    ROOM(state, payload) {
      state.room = payload;
    },
    SELECTROOM(state, payload) {
      state.selectRoom = payload;
    },
    ROOMDETAIL(state, payload) {
      state.roomDetail = payload;
    },
    BOOKINFO(state, payload) {
      state.bookInfo = payload;
    },
  },
  // getters: {
  //   isLoading(state) {
  //     return state.isLoading;
  //   },
  // },
  modules: {
  },
});
