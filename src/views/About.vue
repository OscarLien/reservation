<template>
  <div class="about" v-if="roomDetail">
    <loading :active.sync="isLoading"></loading>
    <div class="imgBanner">
      <router-link to="/">
      <img class="logo" src="../assets/logo_block.svg" alt="" />
      </router-link>
      <div class="roomImg--left">
        <img :src="roomDetail.imageUrl[0]" />
      </div>
      <div class="roomImg--right">
        <img :src="roomDetail.imageUrl[1]" />
        <img :src="roomDetail.imageUrl[2]" />
      </div>
    </div>
    <div class="container mt-5">
      <div class="row">
        <div class="col-6">
          <div class="roomTitle">
            {{ roomDetail.name }}
          </div>
          <div class="roomDetail">
            <ul class="detailShort">
              <li>
                房客人數限制: {{ roomDetail.descriptionShort.GuestMin }} -{{
                  roomDetail.descriptionShort.GuestMax
                }}人
              </li>
              <li>床型: {{ roomDetail.descriptionShort.Bed[0] }}</li>
              <li>
                衛浴數量: {{ roomDetail.descriptionShort["Private-Bath"] }}間
              </li>
              <li>
                房間大小: {{ roomDetail.descriptionShort.Footage }}平方公尺
              </li>
            </ul>
            <p class="detail">{{ roomDetail.description }}</p>
            <span>///</span>
            <div class="checkTime">
              <div class="checkIn">
                <h6>Check In</h6>
                {{ roomDetail.checkInAndOut.checkInEarly }} -
                {{ roomDetail.checkInAndOut.checkInLate }}
              </div>
              <div class="checkOut">
                <h6>Check Out</h6>
                {{ roomDetail.checkInAndOut.checkOut }}
              </div>
            </div>
            <ul class="roomFeature">
              <li :style="{ opacity: isFeature(features['Wi-Fi']) }">
                <img
                  src="../assets/info_icon/wifi.svg"
                  alt=""
                  class="featureImg"
                />Wi-Fi
              </li>
              <li :style="{ opacity: isFeature(features['Television']) }">
                <img
                  src="../assets/info_icon/phone.svg"
                  alt=""
                  class="featureImg"
                />電話
              </li>
              <li :style="{ opacity: isFeature(features['Great-View']) }">
                <img
                  src="../assets/info_icon/mountain-range.svg"
                  alt=""
                  class="featureImg"
                />漂亮的視野
              </li>
              <li :style="{ opacity: isFeature(features['Breakfast']) }">
                <img
                  src="../assets/info_icon/breakfast.svg"
                  alt=""
                  class="featureImg"
                />早餐
              </li>
              <li :style="{ opacity: isFeature(features['Air-Conditioner']) }">
                <img
                  src="../assets/info_icon/breeze.svg"
                  alt=""
                  class="featureImg"
                />空調
              </li>
              <li :style="{ opacity: isFeature(features['Smoke-Free']) }">
                <img
                  src="../assets/info_icon/no-smoke-symbol.svg"
                  alt=""
                  class="featureImg"
                />禁止吸菸
              </li>
              <li :style="{ opacity: isFeature(features['Mini-Bar']) }">
                <img
                  src="../assets/info_icon/bar.svg"
                  alt=""
                  class="featureImg"
                />Mina Bar
              </li>
              <li :style="{ opacity: isFeature(features['Refrigerator']) }">
                <img
                  src="../assets/info_icon/Refrigerator.svg"
                  alt=""
                  class="featureImg"
                />冰箱
              </li>
              <li :style="{ opacity: isFeature(features['Child-Friendly']) }">
                <img
                  src="../assets/info_icon/crawling-baby-silhouette.svg"
                  alt=""
                  class="featureImg"
                />適合兒童
              </li>
              <li :style="{ opacity: isFeature(features['Room-Service']) }">
                <img
                  src="../assets/info_icon/room_service.svg"
                  alt=""
                  class="featureImg"
                />Room Service
              </li>
              <li :style="{ opacity: isFeature(features['Sofa']) }">
                <img
                  src="../assets/info_icon/Sofa.svg"
                  alt=""
                  class="featureImg"
                />沙發
              </li>
              <li :style="{ opacity: isFeature(features['Pet-Friendly']) }">
                <img
                  src="../assets/info_icon/dog.svg"
                  alt=""
                  class="featureImg"
                />寵物友善
              </li>
            </ul>
          </div>
        </div>
        <div class="col-2">
          <div class="price">
            <p class="normalPrice">NT.{{ roomDetail.normalDayPrice }}</p>
            <span class="priceRange">平日(一~四)</span>
            <p class="holidayPrice">NT.{{ roomDetail.holidayPrice }}</p>
            <span class="priceRange">假日(五~日)</span>
          </div>
        </div>
        <div class="col-4">
          <div class="datePicker">
            <vc-date-picker
              v-model="date"
              color="gray"
              is-range
              :min-date="new Date()"
            />
          </div>
          <button class="reservationBtn btn btn-secondary" @click="openMadal">
            預約時段
          </button>
          <button
            class="reservationBtn btn btn-secondary"
            @click="deleteReservation"
          >
            刪除預約
          </button>
        </div>
      </div>
    </div>
    <!-- Modal -->
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
import axios from 'axios';
import $ from 'jquery';

export default {
  components: {},
  data() {
    return {
      date: {
        start: null,
        end: null,
      },
      name: '',
      tel: '',
      weekday: '',
      weekend: '',
      roomId: '',
      // roomDetail: null,
      // bookInfo: null,
      modalTitle: '預約時段',
      // isLoading: true,
    };
  },
  methods: {
    getRoom(id) {
      this.$store.dispatch('getDetailRoom', id);
      // const vm = this;
      // const api = `${process.env.VUE_APP_APIPATH}/room/${id}`;
      // axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      // this.$http.get(api).then((response) => {
      //   const [roomData] = response.data.room;
      //   vm.roomDetail = roomData;
      //   vm.bookInfo = response.data.booking;
      //   vm.isLoading = false;
      // });
    },
    submit(id) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/room/${id}`;
      const form = {
        name: vm.name,
        tel: vm.tel,
        date: vm.formatDate,
      };
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      vm.$http
        .post(api, { ...form })
        .then((response) => {
          if (response.data.success) {
            vm.modalTitle = '預約成功';
          }
        })
        .catch(() => {
          vm.modalTitle = '預約失敗';
        });
    },
    isFeature(feature) {
      return feature ? 1 : 0.3;
    },
    openMadal() {
      $('#myModal').modal('show');
    },
    hideModal() {
      $('#myModal').modal('hide');
      this.modalTitle = '預約時段';
    },
    getTotalNight(date) {
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
      // eslint-disable-next-line radix
      this.weekday = weekday;
      this.weekend = weekend;
    },
    deleteReservation() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/rooms`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      vm.$http.delete(api).then((response) => {
        console.log(response);
      });
    },
  },
  computed: {
    features() {
      const vm = this;
      return vm.roomDetail.amenities;
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
    roomDetail() {
      return this.$store.state.roomDetail;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    bookInfo() {
      return this.$store.state.bookInfo;
    },
  },
  watch: {
    date() {
      this.getTotalNight(this.date);
    },
  },
  created() {
    const vm = this;
    vm.roomId = vm.$route.params.id;
    vm.getRoom(vm.roomId);
  },
};
</script>
