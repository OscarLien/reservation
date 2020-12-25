<template>
  <div class="home">
    <loading :active.sync="isLoading"></loading>
    <template v-for="item in room">
      <transition mode="out-in" :key="item.id">
        <img
          :src="item.imageUrl"
          alt=""
          v-show="item.id === selectRoom.id"
          class="bg"
        />
      </transition>
    </template>
    <transition mode="out-in">
      <div class="wrap" v-if="!isLoading">
        <div class="homeLogo">
          <span>White</span>
          <span>Space</span>
        </div>
        <div class="roomIndex">
          {{ roomIndex }}
        </div>
        <div class="roomName">
          {{ selectRoom.name }}
        </div>
        <div class="sidebar">
          <div
            class="room"
            v-for="(item, index) in room"
            :key="index"
            @mouseover="roomHover(index)"
            @click="gotoRoomDetail(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="socialMedia">
          <img src="@/assets/facebook-square-brands.svg" alt="" />
          <img src="@/assets/instagram-brands.svg" alt="" />
        </div>
        <div class="contact">
          <ul>
            <li>
              <img src="@/assets/phone-alt-solid.svg" alt="" />02-12345678
            </li>
            <li><img src="@/assets/envelope-solid.svg" alt="">whitespace@whitespace.com.tw</li>
            <li><img src="@/assets/home-solid.svg" alt="">台北市羅斯福路十段30號</li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      currentRoomIndex: 1,
      // selectRoom: {
      //   id: '',
      //   imageUrl: '',
      //   normalDayPrice: 0,
      //   holidayPrice: 0,
      //   name: '',
      // },
      // isLoading: true,
    };
  },
  methods: {
    getRoom() {
      this.$store.dispatch('getRoom');
    },
    roomHover(id) {
      const item = this.room[id];
      this.currentRoomIndex = id + 1;
      if (item) {
        // this.selectRoom = item;
        this.$store.state.selectRoom = item;
      }
    },
    gotoRoomDetail(id) {
      this.$router.push(`/about/${id}`);
    },
  },
  computed: {
    roomIndex() {
      return `0${this.currentRoomIndex}`;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    room() {
      return this.$store.state.room;
    },
    selectRoom() {
      return this.$store.state.selectRoom;
    },
  },
  created() {
    this.getRoom();
  },
};
</script>

<style lang="scss">
.slide-enter-active, .slide-leave-active{
  transition: all 0.5s;
}
</style>
