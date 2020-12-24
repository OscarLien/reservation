import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    roomId: '',
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
    modalTitle: '預約時段',
    name: '',
    tel: '',
    weekday: '',
    weekend: '',
    date: {
      start: null,
      end: null,
    },
    formatDate: '',
  },
  actions: {
    UpdateLoading(context, status) {
      context.commit('LOADING', status);
    },
    getRoom(context) {
      const api = `${process.env.VUE_APP_APIPATH}/rooms`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      context.commit('LOADING', true);
      axios.get(api).then((response) => {
        context.commit('ROOM', response.data.items);
        context.commit('SELECTROOM', response.data.items[0]);
        context.commit('LOADING', false);
      });
    },
    getDetailRoom(context, id) {
      const api = `${process.env.VUE_APP_APIPATH}/room/${id}`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      context.commit('LOADING', true);
      axios.get(api).then((response) => {
        const [roomData] = response.data.room;
        context.commit('ROOMDETAIL', roomData);
        context.commit('BOOKINFO', response.data.booking);
        context.commit('LOADING', false);
      });
    },
    submit(context, payload) {
      const api = `${process.env.VUE_APP_APIPATH}/room/${payload.roomId}`;
      const form = {
        name: payload.name,
        tel: payload.tel,
        date: payload.date,
      };
      context.commit('LOADING', true);
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      axios
        .post(api, form)
        .then((response) => {
          if (response.data.success) {
            context.commit('MODALTITLE', '預約成功');
            context.commit('LOADING', false);
          }
        })
        .catch(() => {
          context.commit('MODALTITLE', '預約失敗');
          context.commit('LOADING', false);
        });
    },
    getTotalNight(context, date) {
      const startDay = date.start.getDay();
      const endDay = date.end.getDay();
      const totalDay = parseInt(
        (date.end - date.start) / 1000 / 60 / 60 / 24,
        10,
      );
      let weekday = 0;
      let weekend = 0;
      if (totalDay <= 6) {
        if (startDay > endDay) {
          weekend += 2;
          if (startDay === 6) {
            weekend -= 1;
          }
        } else if (endDay === 6) {
          weekend += 1;
        }
        weekday = totalDay - weekend;
      } else {
        const fullWeekend = ((totalDay - (7 - startDay + endDay)) / 7) * 2;
        weekend += fullWeekend;
        if (startDay === 6) weekend += 1;
        if (endDay === 6) weekend += 1;
        if (startDay <= 5) {
          weekend += 2;
        }
        weekday = totalDay - weekend;
      }
      context.commit('WEEKDAY', weekday);
      context.commit('WEEKEND', weekend);
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
    MODALTITLE(state, payload) {
      state.modalTitle = payload;
    },
    WEEKDAY(state, payload) {
      state.weekday = payload;
    },
    WEEKEND(state, payload) {
      state.weekend = payload;
    },
    DATE(state, payload) {
      state.date = payload;
    },
    ROOMID(state, payload) {
      state.date = payload;
    },
    NAME(state, payload) {
      state.name = payload;
    },
    TEL(state, payload) {
      state.tel = payload;
    },
    FORM(state, payload) {
      state.form = payload;
    },
  },
  modules: {
  },
});
