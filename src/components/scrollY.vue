<template>
  <div class="my-outbox" ref="outbox">
    <div class="my-inbox" ref="movebox">
      <div class="my-listbox" v-for="(item,index) in sendVal" :key="index">
        <div class="my-title">
          {{item.name}}
          <text class="my-utel">{{item.mobile}}</text>
          <text class="my-addr">{{item.place}}</text>
        </div>
        <div class="my-content">{{item.content}}</div>
      </div>
      <div class="my-listbox" v-for="(item,index) in sendVal" :key="(index+1)*100" v-if="isShow">
        <div class="my-title">
          {{item.name}}
          <text class="my-utel">{{item.mobile}}</text>
          <text class="my-addr">{{item.place}}</text>
        </div>
        <div class="my-content">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-marquee-top",
  props: {
    sendVal: Array
  },
  data() {
    return {
      isShow: true
    };
  },
  mounted: function() {
    var moveTarget = this.$refs.movebox;
    var outbox = this.$refs.outbox;
    if (outbox.offsetHeight > moveTarget.offsetHeight / 2) {
      this.isShow = false;
      return;
    }
    var initTop = 0;
    setInterval(function() {
      initTop++;
      if (initTop >= moveTarget.offsetHeight / 2) {
        initTop = 0;
      }
      moveTarget.style = "transform: translateY(-" + initTop + "px)";
    }, 50);
  }
};
</script>

<style  scoped>
.my-outbox {
  color: #fee7b1;
  height: 20px;
  margin: 10px auto ;
  /* background: #fee7b1; */
  text-align: center;
  overflow: hidden;
}
.my-inbox {
}
.my-listbox {
  padding: 20px 0;
  font-size: 12px;
}
.my-title {
  color: #db7000;
  margin-bottom: 10px;
  clear: both;
  overflow: hidden;
}
.my-utel {
  font-size: 16px;
  margin-left: 20px;
}
.my-addr {
  font-size: 16px;
  float: right;
}
.my-content {
  text-align: justify;
  word-break: break-all;
  font-size: 14px;
  color: #53565d;
}
</style>