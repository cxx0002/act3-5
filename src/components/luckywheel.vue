<template>
  <div class="container">
    <div class="contain_box" v-show="!token">
      <div class="contain_test" v-show="noToken">当前版本不支持</div>
      <div class="contain_test2" v-show="!noToken">
        <img :src="loadingImg" alt />
      </div>
    </div>
    <div class="scroll_text" v-show="token">
      <marqueeX :sendVal="dm"></marqueeX>
    </div>
    <div class="box" v-show="token">
      <div class="header">
        <img :src="backImg" alt @click="backkhd" />
        <p>活动大厅</p>
      </div>
    </div>
    <div class="lucky-wheel" v-show="token">
      <div class="lucky-title"></div>
      <div class="wheel-main">
        <div class="wheel-pointer" @click="beginRotate()"></div>
        <div class="wheel-bg" :style="rotateStyle">
          <div class="prize-list">
            <div
              class="prize-item"
              v-for="(item,index) in prizeList"
              :key="index"
              :style="item.style"
            >
              <div class="prize-pic">
                <div class="prize-type">{{item.name}}</div>
                <img :src="item.icon" class="prize_img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flower" v-show="token"></div>
    <div class="tui" v-show="token"></div>
    <div class="main" v-show="token">
      <div class="main-bg"></div>
      <div class="bg-p"></div>
      <div class="content">
        <div class="count">
          <br />
          <p style="font-size:.8rem">
            <span class="go_btn" @click="getchance">看视频获取{{videos}}次抽奖机会</span>
          </p>
        </div>
      </div>
      <div class="tip2" v-show="loginValid&&token">
        <div class="tip2-title">中奖记录</div>
        <div class="tip2-content">
          <li v-for="(item,key) in goodsList" :key="key">
            <span>{{item.date}}</span>
            <span>{{item.award}}</span>
          </li>
        </div>
      </div>
      <div class="tip" v-show="token">
        <div class="tip-title">活动规则</div>
        <div class="tip-content">
          <p>
            1. 用户每天获赠
            <span>{{free}}</span>次抽奖机会，每完整观看一次小视频可额外获得
            <span>{{videos}}</span>次抽奖机会。
          </p>
          <p>2. 每次观看完小视频即可获得奖励，中途退出视为放弃抽奖机会。</p>
          <p>3. 每日0点刷新抽奖机会。</p>
          <p>4. 本活动最终解释权归{{appPackage}}所有。</p>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize&&loginValid&&token">
      <div class="toast-container">
        <!-- <img :src="toastIcon" class="toast-picture" /> -->
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{toastTitle}}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="closeToast">关闭</div>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize&&!loginValid&&iszj&&token">
      <div class="toast-container">
        <!-- <img :src="toastIcon" class="toast-picture" /> -->
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{toastTitle}}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="goLogin">登录领取</div>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize&&!loginValid&&!iszj&&token">
      <div class="toast-container">
        <!-- <img :src="toastIcon" class="toast-picture" /> -->
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{toastTitle}}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="closeToast">关闭</div>
        </div>
      </div>
    </div>
    <div class="toast-mask" v-show="prize&&token"></div>

    <div class="toast" v-show="havenot&&token">
      <div class="toast-container">
        <!-- <img :src="toastIcon" class="toast-picture" /> -->
        <div class="close" @click="havenot = false"></div>
        <div class="toast-title2">抽奖机会已用完，完整观看视频可额外获得{{videos}}次抽奖机会</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="getchance">去看视频</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@/utils/bridge.js";
import { prizeList } from "./config";
import axios from "axios";
const CIRCLE_ANGLE = 360;

const config = {
  // 总旋转时间
  duration: 3000,
  // 旋转圈数
  circle: 6,
  mode: "linear"
};
import backImg from "../assets/img/back.png";
import loadingImg from "../assets/img/loading.gif";
import thanksImg from "../assets/img/thanks.png";
import marqueeX from "@/components/scrollX";
export default {
  data() {
    return {
      backImg: backImg,
      loadingImg: loadingImg,
      dm: [],
      host: "http://newtestuser.smaoxs.com",
      endFlag: true,
      count: 100, // 剩余抽奖次数
      duration: 3000, // 转盘旋转时间
      prizeList: [], // 奖品列表
      rotateAngle: 0, // 旋转角度
      index: 0,
      prize: null,
      havenot: false,
      goodsList: [], //获奖记录
      // token: "o9fZyMJ068NNOLTYfRy/o60RP7o=",
      token:
        "VuNpshQD980E987kna2b963xA17pOz0298IPVh0t9unwnf7kOfKksbnmRTGbikQys6pNlYnmnadIRHqt0891ljJGRjD6-j0k0SvboYNGOH5Clf3uOTnmnv5UlhNWi8DboYNCO6xkObnmnaQf7TxyR1kUKqGWlA5f9MKq967RTbxl-hQ5OqdWqdv3nbGb78kvna2bRt5fRjRuRa9yR8Du0S0k9jvC0akp9fdylj9C0SkbRtgbPD==",
      loginStatus: null,
      activityId: 1,
      jpName: "",
      video: false,
      loginValid: false,
      iszj: false,
      reallyPrizeList: [
        {
          icon: "", // 奖品图片
          // 奖品名称
          isPrize: 1, // 该奖项是否为奖品
          id: 0
        },
        {
          icon: thanksImg,
          name: "谢谢参与",
          isPrize: 0,
          id: 0
        },
        {
          icon: "",

          isPrize: 1,
          id: 0
        },
        {
          icon: thanksImg,
          name: "谢谢参与",
          isPrize: 0,
          id: 0
        },
        {
          icon: "",

          isPrize: 1,
          id: 0
        },
        {
          icon: thanksImg,
          name: "谢谢参与",
          isPrize: 0,
          id: 0
        },
        {
          icon: "",

          isPrize: 1,
          id: 0
        },
        {
          icon: thanksImg,
          name: "谢谢参与",
          isPrize: 0,
          id: 0
        }
      ],
      loginValid2: false,
      nowTime: "",
      isPlat: false,
      appPackage: "快小说",
      noToken: false,
      free: "",
      videos: "",
      checkSuccess: false,
      tryTimes: 0
    };
  },
  components: { marqueeX },
  created() {
    // 判断安卓
    var u = navigator.userAgent;
    if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
      this.isPlat = false;
    }
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      this.isPlat = true;
    }
    //看完视频成功回调
    let that = this;

    if (!that.isPlat) {
      that.$bridge.registerhandlerAndroid(
        "td_native_function_callback",
        (data, responseCallback) => {
          data = JSON.parse(data);
          if (data.type == "td_native_type_rewordLogin") {
            if (data.status == 0) {
              that.loginCheck();
            } else {
            }
          }
          if (data.type == "td_native_type_rewordVideo") {
            if (data.status == 0) {
              that.havenot = false;
              that.addChance();
            } else {
            }
          }
        }
      );
    } else {
      that.$bridge.registerhandlerIOS(
        "td_native_function_callback",
        (data, responseCallback) => {
          data = JSON.parse(data);
          if (data.type == "td_native_type_rewordLogin") {
            if (data.status == 0) {
              that.loginCheck();
            } else {
            }
          }
          if (data.type == "td_native_type_rewordVideo") {
            if (data.status == 0) {
              that.havenot = false;
              that.addChance();
            } else {
            }
          }
        }
      );
    }

    // 初始化一些值
    this.angleList = [];
    // 是否正在旋转
    this.isRotating = false;
    // 基本配置
    this.config = config;

    // 获取奖品列表
    this.initPrizeList();
  },
  computed: {
    rotateStyle() {
      return `
        -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
        transition: transform ${this.config.duration}ms ${this.config.mode};
        -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`;
    },
    toastTitle() {
      return this.prize && this.prize.isPrize === 1
        ? "恭喜您，获得" + this.prize.name
        : "谢谢参与";
    },
    toastIcon() {
      return this.prize && this.prize.isPrize === 1
        ? require("../assets/img/congratulation.png")
        : require("../assets/img/sorry.png");
    }
  },
  mounted() {
    var u = navigator.userAgent;
    if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
      this.isPlat = false;
    }
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      this.isPlat = true;
    }
    this.nowTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000;

    if (!this.isPlat) {
      this.$bridge.callhandlerAndroid(
        "td_js_function_headerBg",
        {
          background: "#DB4C19"
        },
        function(responseData) {}
      );
    } else {
      this.$bridge.callhandlerIOS(
        "td_js_function_headerBg",
        {
          background: "#DB4C19"
        },
        function(responseData) {}
      );
    }

    let that = this;
    // setTimeout(() => {
    if (!that.isPlat) {
      that.$bridge.callhandlerAndroid(
        "td_js_function_nativeInfo",
        {},
        function responseCallback(data) {
          //获取到iOS回调后需要做的事情写在这里
          that.token = JSON.parse(data).header;
          let appPackage = JSON.parse(data).pub_parm.appPackage;
          if (appPackage == "com_abifong_mfxssc") {
            that.appPackage = "免费小说书城";
          }
          if (appPackage == "com_shunmao_xsssydq") {
            that.appPackage = "免费小说阅读器";
          }
          if (appPackage == "com_shunmao_zymfxs") {
            that.appPackage = "追阅免费小说";
          }
          if (appPackage == "com_kdmfxs_kxsydq") {
            that.appPackage = "快小说免费阅读器";
          }

          that.checkLogin();
        }
      );
    } else {
      that.$bridge.callhandlerIOS(
        "td_js_function_nativeInfo",
        {},
        function responseCallback(data) {
          //获取到iOS回调后需要做的事情写在这里
          that.token = JSON.parse(data).header;
          let appPackage = JSON.parse(data).pub_parm.appPackage;
          if (appPackage == "com_wanshan_xssc") {
            that.appPackage = "快小说";
          }
          if (appPackage == "com_wanshan_xsreader") {
            that.appPackage = "追阅小说大全";
          }

          that.checkLogin();
        }
      );
    }

    that.checkLogin();
    setTimeout(() => {
      if (that.token == "") {
        this.noToken = true;
      }
    }, 2000);
    // }, 0);
    // that.checkLogin();
  },
  methods: {
    bringPrize() {
      axios({
        method: "post",
        url: this.host + "/api/v1/activity/turnplate/draw/" + this.activityId,
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.getGoodList();
        this.tellKhd();
      });
    },
    loginCheck() {
      let that = this;
      if (!that.isPlat) {
        that.$bridge.callhandlerAndroid(
          "td_js_function_nativeInfo",
          {},
          function responseCallback(data) {
            //获取到iOS回调后需要做的事情写在这里
            that.token = JSON.parse(data).header;
            that.checkLogin2();
          }
        );
      } else {
        that.$bridge.callhandlerIOS(
          "td_js_function_nativeInfo",
          {},
          function responseCallback(data) {
            //获取到iOS回调后需要做的事情写在这里
            that.token = JSON.parse(data).header;
            that.checkLogin2();
          }
        );
      }
    },
    goLogin() {
      if (!this.isPlat) {
        this.$bridge.callhandlerAndroid(
          "td_js_function_toLogin",
          {},
          function responseCallback(responseData) {
            //获取到iOS回调后需要做的事情写在这里
          }
        );
      } else {
        this.$bridge.callhandlerIOS(
          "td_js_function_toLogin",
          {},
          function responseCallback(responseData) {
            //获取到iOS回调后需要做的事情写在这里
          }
        );
      }
    },
    getchance() {
      if (!this.isPlat) {
        this.$bridge.callhandlerAndroid(
          "td_js_function_rewordVideo",
          { status: 1 },
          function responseCallback(responseData) {
            //获取到iOS回调后需要做的事情写在这里
          }
        );
      } else {
        this.$bridge.callhandlerIOS(
          "td_js_function_rewordVideo",
          { status: 1 },
          function responseCallback(responseData) {
            //获取到iOS回调后需要做的事情写在这里
          }
        );
      }
    },
    checkLogin2() {
      axios({
        method: "get",
        url: this.host + "/api/v1/user/check",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.loginValid = res.data.data.loginValid;
        this.bringPrize();
      });
    },
    checkLogin() {
      axios({
        method: "get",
        url: this.host + "/api/v1/user/check",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.loginValid = res.data.data.loginValid;
        this.checkSuccess=true;
        this.getchanceList();
        this.getPrizeList();
      });
      let that = this;
      setTimeout(() => {
        if (!that.checkSuccess && this.tryTimes < 3) {
          that.tryTimes++;
          that.checkLogin();
        }
      }, 3000);
    },
    getchanceList() {
      axios({
        method: "get",
        url: this.host + "/api/v1/activity/desc",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.free = res.data.data.free;
        this.videos = res.data.data.video;
      });
    },
    initPrizeList() {
      // 这里可以发起请求，从服务端获取奖品列表
      // 这里使用模拟数据
      this.prizeList = this.formatPrizeList(this.reallyPrizeList);
    },
    // 格式化奖品列表，计算每个奖品的位置
    formatPrizeList(list) {
      // 记录每个奖的位置
      const angleList = [];

      const l = list.length;
      // 计算单个奖项所占的角度
      const average = CIRCLE_ANGLE / l;

      const half = average / 2;

      // 循环计算给每个奖项添加style属性
      list.forEach((item, i) => {
        // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
        const angle = -(i * average + half);
        // 增加 style
        item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`;

        // 记录每个奖项的角度范围
        angleList.push(i * average + half);
      });
      this.angleList = angleList;
      return list;
    },
    beginRotate() {
      // 开始抽奖
      // 这里这里向服务端发起请求，得到要获得的奖
      // 可以返回下标，也可以返回奖品 id，通过查询 奖品列表，最终得到下标

      if (this.endFlag) {
        // 随机获取下标

        axios({
          method: "post",
          url: this.host + "/api/v1/activity/turnplate/" + this.activityId,
          data: {},
          contentType: "application/json",
          headers: { "x-device-data": this.token }
        }).then(res => {
          if (res.data.code == 0) {
            if (res.data.data.id == -1) {
              this.endFlag = false;
              this.index = 1;
              this.iszj = false;
            } else {
              this.index = this.getIndex(
                this.reallyPrizeList,
                res.data.data.id
              );
              this.iszj = true;

              if (this.loginValid) {
                this.tellKhd();
              }
            }

            this.rotating();
          } else {
            this.havenot = true;
          }
        });
        // 开始旋转
      }
    },
    random(max, min = 0) {
      return parseInt(Math.random() * (max - min + 1) + min);
    },
    rotating() {
      const { isRotating, angleList, config, rotateAngle, index } = this;

      if (isRotating) return;

      this.isRotating = true;

      // 计算角度
      const angle =
        // 初始角度
        rotateAngle +
        // 多旋转的圈数
        config.circle * CIRCLE_ANGLE +
        // 奖项的角度
        angleList[index] -
        (rotateAngle % CIRCLE_ANGLE);

      this.rotateAngle = angle;

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.rotateOver();
      }, config.duration + 1000);
    },
    rotateOver() {
      this.isRotating = false;

      this.prize = this.reallyPrizeList[this.index];

      this.endFlag = true;
      // console.log(this.prize, this.index);
    },
    //关闭弹窗
    closeToast() {
      this.prize = null;
      this.getGoodList();
    },
    getVideo() {
      if (!this.isPlat) {
        this.$bridge.callhandlerAndroid(
          "td_js_function_rewordVideo",
          { action: "onbackpressed", data: {} },
          function(res) {}
        );
      } else {
        this.$bridge.callhandlerIOS(
          "td_js_function_rewordVideo",
          { action: "onbackpressed", data: {} },
          function(res) {}
        );
      }
    },
    //  返回登录
    backkhd() {
      if (!this.isPlat) {
        this.$bridge.callhandlerAndroid("td_js_function_exit", {}, function(
          responseData
        ) {});
      } else {
        this.$bridge.callhandlerIOS("td_js_function_exit", {}, function(
          responseData
        ) {});
      }
    },
    back() {},
    getList() {
      axios({
        method: "get",
        url: this.host + "/api/v1/activity/turnplate/bingo",
        params: { activityId: this.activityId },
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.dm = [];
        for (var i in res.data.data) {
          this.dm[i] = {
            name:
              "恭喜" +
              res.data.data[i].userName +
              "，获得了" +
              res.data.data[i].award +
              "！"
          };
        }
      });
    },
    getPrizeList() {
      axios({
        method: "get",
        url: this.host + "/api/v1/activity/data",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        if (res.data.code == 0) {
          this.activityId = res.data.data.activityId;
          this.reallyPrizeList[0].name = res.data.data.awards[0].title;
          this.reallyPrizeList[0].id = res.data.data.awards[0].id;
          this.reallyPrizeList[0].icon = res.data.data.awards[0].img;
          this.reallyPrizeList[2].name = res.data.data.awards[1].title;
          this.reallyPrizeList[2].id = res.data.data.awards[1].id;
          this.reallyPrizeList[2].icon = res.data.data.awards[1].img;
          this.reallyPrizeList[4].name = res.data.data.awards[2].title;
          this.reallyPrizeList[4].id = res.data.data.awards[2].id;
          this.reallyPrizeList[4].icon = res.data.data.awards[2].img;
          this.reallyPrizeList[6].name = res.data.data.awards[3].title;
          this.reallyPrizeList[6].id = res.data.data.awards[3].id;
          this.reallyPrizeList[6].icon = res.data.data.awards[3].img;
          this.getList();
          setTimeout(() => {
            this.getList();
          }, 15000);
          axios({
            method: "get",
            url: this.host + "/api/v1/activity/turnplate/record",
            params: {},
            contentType: "application/json",
            headers: { "x-device-data": this.token }
          }).then(res => {
            this.goodsList = res.data.data;
          });
        }
      });
    },
    getGoodList() {
      axios({
        method: "get",
        url: this.host + "/api/v1/activity/turnplate/record",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.goodsList = res.data.data;
      });
    },
    addChance() {
      axios({
        method: "get",
        url: this.host + "/api/v1/bury/video-play",
        params: {},
        contentType: "application/json",
        headers: { "x-device-data": this.token }
      }).then(res => {
        this.getPrizeList();
      });
    },
    getIndex(arr, value) {
      for (var i = 0, vlen = arr.length; i < vlen; i++) {
        if (arr[i].id == value) {
          return i;
        }
      }
      return -1;
    },
    tellKhd() {
      if (!this.isPlat) {
        this.$bridge.callhandlerAndroid(
          "td_js_function_updateUserInfo",
          {},
          function(res) {}
        );
      } else {
        this.$bridge.callhandlerIOS(
          "td_js_function_updateUserInfo",
          {},
          function(res) {}
        );
      }
    }
  }
};
</script>
<style scoped>
.box {
  height: 50px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10000;
}
.header {
  background: rgb(219, 76, 25);
  line-height: 50px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 40px;
}
.header img {
  width: 25px;
  height: 25px;
}
.header p {
  text-align: center;
  flex: 1;
  color: #fff;
}
.container {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.lucky-wheel {
  margin-top: 49px;
  width: 100%;
  background: rgb(252, 207, 133) url("../assets/img/color_pillar.png") no-repeat
    center bottom;
  background-size: 100%;
  padding-top: 20px;
}
.lucky-title {
  width: 100%;
  height: 8.125rem;
  background: url("../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}
.wheel-main {
  margin: 0 auto;
  position: relative;
  width: 295px;
  height: 295px;
}
.wheel-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: url("../assets/img/dial.png") no-repeat center top;
  background-size: 100%;
  color: #fff;
}
.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 85px;
  height: 95px;
  background: url("../assets/img/pointer.png") no-repeat center;
  z-index: 100;
  background-size: 100%;
  transform: translate3d(-50%, -50%, 0);
}
.wheel-bg div {
  text-align: center;
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
}
.prize-list div .prize-pic .prize-type {
  font-family: Adobe Heiti Std;
  font-weight: bold;
  color: rgba(168, 135, 42, 1);
  font-weight: bold;
  color: #fb6056;
}
.prize-list div .prize-pic img {
  margin-top: 0.7rem;
  width: 1.4rem;
  width: 1.4rem;
}
.prize-list div:nth-of-type(2n) .prize-pic .prize-type {
  color: #a8872a;
  font-family: Adobe Heiti Std;
  font-weight: bold;
}
.prize-list div:nth-of-type(2n) .prize-pic img {
  margin-top: 0.8rem;
  width: 1.6rem;
  width: 1.6rem;
}

.prize-list .prize-item {
  position: absolute;
  width: 95px;
  height: 150px;
  top: 0;
  left: 50%;
  margin-left: -47.5px;
  transform-origin: 50% 100%;
}

.prize-count {
  font-size: 0.875rem;
}
.prize-type {
  padding-top: 2.2rem;
  font-size: 0.6rem;
}
.main {
  position: relative;
  width: 100%;
  min-height: 26rem;
  background: rgb(243, 109, 86);
  padding-bottom: 1.6875rem;
}

.main-bg {
  width: 100%;
  height: 6.5625rem;
  position: absolute;
  top: -3.4375rem;
  left: 0;
  background: url("../assets/img/luck_bg.png") no-repeat center top;
  background-size: 100%;
}
.bg-p {
  width: 100%;
  height: 2.95rem;
  background: rgb(252, 207, 133);
}
.content {
  position: absolute;
  top: 1rem;
  left: 0;
  background: rgb(243, 109, 86);
  width: 100%;
  height: 5.1875rem;
  font-size: 1.125rem;
  color: #ffeb39;
}
.content div {
  text-align: center;
  line-height: 2rem;
}
.tip {
  position: relative;
  margin: 4rem auto 0;
  width: 17.5rem;
  border: 1px solid #fbc27f;
}
.tip-title {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.625rem;
}
.tip-content {
  padding: 1.5625rem 0.625rem;
  font-size: 0.875rem;
  color: #fff8c5;
  line-height: 1.5;
}
.tip-content p {
  line-height: 1.2rem;
  font-size: 0.775rem;
}
.tip2 {
  position: relative;
  margin: 5rem auto 0;
  width: 17.5rem;
  border: 1px solid #fbc27f;
}
.tip2-title {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.625rem;
}
.tip2-content {
  padding: 0 0.625rem;
  font-size: 0.775rem;
  color: #fff8c5;
  line-height: 1.5;
  margin: 1.5rem 0;
  height: 8rem;
  overflow-y: scroll;
  text-align: left;
}
.tip2-content li {
  display: flex;
  padding: 0 1rem;
}
.tip2-content li span {
  text-align: left;
  padding-left: 2em;
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 15.4375rem;
  background: #fff;
  border-radius: 0.3125rem;
  padding: 0.3125rem;
  background-color: rgb(252, 244, 224);
}
.toast-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dotted #fccc6e;
}
.toast-picture {
  position: absolute;
  top: -6.5rem;
  left: -1.5rem;
  width: 18.75rem;
  height: 8.5625rem;
}
.toast-pictrue-change {
  position: absolute;
  top: -1.5rem;
  left: -1.375rem;
  width: 17.5rem;
  height: 3.125rem;
}
.toast-title {
  padding: 2.8125rem 0;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}
.toast-title2 {
  padding: 2rem 1rem;
  font-size: 14px;
  line-height: 30px;
  color: #fc7939;
  text-align: center;
}
.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9375rem;
}
.toast-btn div {
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );

  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 6.6875rem;
  height: 1.875rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 1.875rem;
  color: #fff;
}
.close {
  position: absolute;
  top: -0.9375rem;
  right: -0.9375rem;
  width: 2rem;
  height: 2rem;
  background: url("../assets/img/close_store.png") no-repeat center top;
  background-size: 100%;
}
.scroll_text {
  position: absolute;
  width: 100%;
  top: 50px;
  color: #fff;
  font-size: 10px;
}
.go_btn {
  margin-top: 0.1rem;
  display: inline-block;
  background: #fff;
  -webkit-box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  padding: 0 20px;
  height: 2rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 2rem;
  color: #eb3c08;
  font-weight: bold;
}
.go_btn:active {
  color: yellow;
}
.tui {
  position: absolute;
  top: 0;
  margin: 300px auto 0;
  width: 100%;
  height: 600px;
  background: url("../assets/img/tui.png") no-repeat center top;
}
.flower {
  position: absolute;
  top: 100px;
  width: 100%;
  height: 600px;
  background: url("../assets/img/bg.png");
  background-size: 100%;
}
.contain_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
}
.contain_test {
  width: 300px;
  height: 100px;
  line-height: 100px;
  font-weight: 600;
  margin: 50% auto;
  background: #fff;
  border-radius: 10px;
  font-size: 18px;
  text-align: center;
}
.contain_test2 {
  width: 300px;
  height: 100px;
  line-height: 200px;
  font-weight: 600;
  margin: 50% auto;
  border-radius: 10px;
  text-align: center;
  font-size: 50px;
}
.prize-pic .prize_img {
  width: 2.2rem !important;
}
</style>

