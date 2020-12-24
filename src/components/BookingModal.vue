<template>
  <div>
    <div
      class="modal fade"
      id="myModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              {{ modalTitle }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="modalTitle === '預約時段'">
            <div class="modal-container">
              <div class="form-group">
                <label for="" class="formLabel">姓名</label>
                <input type="text" class="form-control" v-model="name" />
              </div>
              <div class="form-group">
                <label for="" class="formLabel">電話</label>
                <input type="tel" class="form-control" v-model="tel" />
              </div>
              <div class="form-group">
                <label for="" class="formLabel">預約起迄</label>

                <vc-date-picker v-model="date" is-range :min-date="new Date()">
                  <template v-slot="{ inputValue, inputEvents }">
                    <div class="flex justify-center items-center">
                      <input
                        :value="inputValue.start"
                        v-on="inputEvents.start"
                        class="border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
                      />~
                      <input
                        :value="inputValue.end"
                        v-on="inputEvents.end"
                        class="border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
                      />
                    </div>
                  </template>
                </vc-date-picker>
              </div>
            </div>
            <div class="bookingDay">
              <div class="modal-container">
                <div class="countDay">
                  <p>平日時段</p>
                  <p>{{ weekday }}夜</p>
                </div>
                <div class="countDay">
                  <p>假日時段</p>
                  <p>{{ weekend }}夜</p>
                </div>
              </div>
            </div>
            <div class="modal-container">
              <div class="bookingPrice">
                = NT.{{
                  weekday * roomDetail.normalDayPrice +
                  weekend * roomDetail.holidayPrice
                }}
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="modalTitle === '預約時段'">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submit(roomId)"
            >
              確定預約
            </button>
          </div>
          <div v-if="modalTitle === '預約成功'">
            <div class="modal-body">
              <div class="modal-container">
                <div class="bookSuccess">
                  <img
                    src="../assets/info_icon/tick-inside-circle.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="modalTitle === '預約成功'">
            <button type="button" class="btn btn-secondary" @click="hideModal">
              回首頁
            </button>
          </div>
          <div v-if="modalTitle === '預約失敗'">
            <div class="modal-body">
              <div class="modal-container">
                <div class="bookSuccess">
                  <p>預約時間已被人預訂</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="modalTitle === '預約失敗'">
            <button type="button" class="btn btn-secondary" @click="hideModal">
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
    };
  },
  methods: {
    hideModal() {
      $('#myModal').modal('hide');
      this.$store.state.modalTitle = '預約時段';
      this.$store.dispatch('getDetailRoom', this.roomId);
    },
    submit() {
      const vm = this;
      const form = {
        name: this.name,
        tel: this.tel,
        date: this.formatDate,
        roomId: this.$route.params.id,
      };
      vm.$store.dispatch('submit', form);
    },
    getTotalNight(date) {
      this.$store.dispatch('getTotalNight', date);
    },
  },
  computed: {
    roomId() {
      return this.$store.state.roomId;
    },
    roomDetail() {
      return this.$store.state.roomDetail;
    },
    modalTitle() {
      return this.$store.state.modalTitle;
    },
    weekday() {
      return this.$store.state.weekday;
    },
    weekend() {
      return this.$store.state.weekend;
    },
    form() {
      return this.$store.state.form;
    },
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        this.$store.commit('DATE', value);
      },
    },
    name: {
      get() {
        return this.$store.state.name;
      },
      set(value) {
        this.$store.commit('NAME', value);
      },
    },
    tel: {
      get() {
        return this.$store.state.tel;
      },
      set(value) {
        this.$store.commit('TEL', value);
      },
    },
    formatDate() {
      const vm = this;
      const dateStart = vm.date.start;
      let totalNight = parseInt(
        (vm.date.end - vm.date.start) / 1000 / 60 / 60 / 24,
        10,
      );
      if (Math.floor(vm.date.start) === Math.floor(vm.date.end)) totalNight = 1;
      const dateArray = [];
      for (let i = 0; i < totalNight; i += 1) {
        dateArray.push(
          new Date(dateStart.getTime() + 1000 * 60 * 60 * 24 * i + 3600000 * 8)
            .toISOString()
            .slice(0, 10),
        );
      }
      return dateArray;
    },
  },
  watch: {
    date() {
      this.getTotalNight(this.date);
    },
  },
};
</script>
