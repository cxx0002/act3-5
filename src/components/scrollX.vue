<template>
  <div class="my-outbox">
    <div class="my-inbox" ref="box">
      <div class="my-list" v-for="(item,index) in sendVal" :key="index">
        <span class="my-uname">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-marquee-left",
  props: {
    sendVal: Array
  },
  data() {
    return {};
  },
  mounted: function() {
    var that = this;
    var target = this.$refs.box;
    var initLeft = 0;
    setInterval(function() {
      initLeft++;
      if (initLeft >= target.offsetWidth / 2) {
        initLeft = 0;
      }
      target.style = "transform: translateX(-" + initLeft + "px)";
    }, 15);
  }
};
</script>

<style  scoped>
.my-outbox {
  color: #d7bc8d;
  overflow: hidden;
  height: 26px;
  position: relative;
  background: rgba(0,0,0,.1);
  padding:0 30px;
  overflow: hidden;
}
.my-inbox {
  white-space: nowrap;
  position: absolute;
  font-size: 0;
  padding:0 30px;
  overflow: hidden;
}
.my-uname {
  color: orangered;
}
.my-list {
  margin-right: 120px;
  display: inline-block;
  font-size: 13px;
  height: 26px;
  line-height: 26px;
}
</style>