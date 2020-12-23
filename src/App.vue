<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "./assets/all.scss";
*{
  margin: 0;
  padding: 0;
}
html, body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app{
  background-size: cover;
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
