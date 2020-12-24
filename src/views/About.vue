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
          <button class="reservationBtn btn btn-secondary" @click="openModal">
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
    <BookingModal></BookingModal>
  </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import BookingModal from '@/components/BookingModal.vue';

export default {
  components: {
    BookingModal,
  },
  data() {
    return {
    };
  },
  methods: {
    getRoom(id) {
      this.$store.dispatch('getDetailRoom', id);
    },
    isFeature(feature) {
      return feature ? 1 : 0.3;
    },
    openModal() {
      $('#myModal').modal('show');
    },
    getTotalNight(date) {
      this.$store.dispatch('getTotalNight', date);
    },
    deleteReservation() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/rooms`;
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.VUE_APP_APITOKEN}`;
      vm.$http.delete(api).then((response) => {
        console.log(response);
        vm.getRoom(vm.roomId);
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
    modalTitle() {
      return this.$store.state.modalTitle;
    },
    weekday() {
      return this.$store.state.weekday;
    },
    weekend() {
      return this.$store.state.weekend;
    },
    roomId() {
      return this.$store.state.roomId;
    },
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        this.$store.commit('DATE', value);
      },
    },
  },
  watch: {
    date() {
      this.getTotalNight(this.date);
    },
  },
  created() {
    const vm = this;
    vm.$store.state.roomId = vm.$route.params.id;
    vm.getRoom(vm.roomId);
  },
};
</script>
