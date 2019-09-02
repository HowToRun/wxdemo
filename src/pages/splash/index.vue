<template>
  <div class="container">
    <div class="remind-box">
      <image class="remind-img" src=""></image>
    </div>
    <div>
      <text class="title">marry</text>
      <div class="content">
        <div class="hd" >
          <image class="logo" :src="loading"></image>
          <image class="wave" :src="wave" mode="aspectFill"></image>
          <image class="wave wave-bg" :src="wave" mode="aspectFill"></image>
        </div>
        <button class="confirm-btn" open-type="getUserInfo" @click="btnEnter">点击进入</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js'
import app from '@/App'
// 正式环境
const AppId = 'wx5ddf33b1371e2915'
const AppSecret = '64fe5cb578b822b730897f0945204ebb'
// 开发测试
// const AppId = 'wx66cceb965b3b9a14'
// const AppSecret = '9137735114bf8ca1516c133b49f60ab4'
export default {
  data () {
    return {
      loading: '/static/images/user.png',
      appName: 'Marry',
      angle: '',
      logo: '/static/images/user.png',
      wave: '/static/images/wave.png'
    }
  },

  methods: {
    getUserInfo () {
      console.log('getUserInfo')
      wx.getUserInfo({
        success: function (e) {
          if (e.errMsg === 'getUserInfo:ok') {
            console.log('获取用户信息成功')
            app.globalData.userInfo = e.rawData
            console.log(app.globalData.userInfo)
          } else {
            console.log('fail', '获取用户信息失败')
            wx.showModal({
              title: '提示',
              content: '获取用户信息失败',
              showCancel: false,
              confirmColor: '#e2211c',
              success (res) {
              }
            })
          }
        }
      })
      console.log('index user info:', app.globalData.userInfo)
    },
    bindViewTap () {
      const url = '../logs/main'
      if (mpvuePlatform === 'wx') {
        mpvue.switchTab({ url })
      } else {
        mpvue.navigateTo({ url })
      }
    },
    getOpenId () {
      // 调用登录接口，获取 code
      wx.login({
        success: function (res) {
          console.log(res.code)
          // 发起网络请求
          wx.request({
            url: api.mobileIn + 'getOpenId',
            data: {
              appid: AppId,
              secret: AppSecret,
              code: res.code,
              grantType: 'authorization_code'
            },
            header: {
              method: 'GET_OPENID'
            },
            method: 'GET',
            success: function (res) {
              let openid = res.data.data.openid
              // 将openId设成全局
              app.globalData.openId = openid
              console.log('res.data.openid', res.data.data.openid)
            },
            fail: function (res) { },
            complete: function (res) {
            }
          })
        }
      })
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
      // throw {message: 'custom test'}
    },
    btnEnter () {
      console.log('btnEnter')
      // this.getUserInfo()
      wx.switchTab({
        url: '/pages/index/main'
      })
    }
  },
  created () {
  },
  onLoad: function () {
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
              console.log('authorize success')
            },
            fail () {
              console.log('authorize fail')
            }
          })
        }
      }
    })
  },
  onReady: function () {
    this.getOpenId()
  },
  onShow () {
  }
}
</script>

<style scoped>
  /**login.wxss**/
  page{
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(244,244,244,0)), color-stop(0.1, #f4f4f4), to(#f4f4f4));
  }
  .container {
    background: pink;
    align-items: stretch;
    padding: 0;
    height: 100%;
    overflow: hidden;
    width: 100%
  }
  .content{
    flex: 1;
    display: flex;
    position: relative;
    z-index: 10;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-bottom: 550rpx;
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(244,244,244,0)), color-stop(0.1, #f4f4f4), to(#f4f4f4));
    opacity: 0;
    transform: translate3d(0,100%,0);
    animation: rise 3s cubic-bezier(0.19, 1, 0.22, 1) .25s forwards;
  }
  @keyframes rise{
    0% {opacity: 0;transform: translate3d(0,100%,0);}
    50% {opacity: 1;}
    100% {opacity: 1;transform: translate3d(0,450rpx,0);}
  }
  .title{
    position: absolute;
    top: 120rpx;
    left: 50%;
    width: 600rpx;
    height: 50rpx;
    margin-left: -150rpx;
    opacity: 0;
    animation: show 2.5s cubic-bezier(0.19, 1, 0.22, 1) .5s forwards;
    color: white;
    font-size: 55px;
    font-weight: bolder;
  }

  @keyframes show{
    from {opacity: 0; transform: translate3d(-200rpx,0,0); }
    to {opacity: 1; transform: translate3d(0,0,0); }
  }
  .remind_box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 300rpx;
  }
  .remind_img {
    width: 250rpx;
    height: 250rpx;
    padding-top: 150rpx;
  }
  .hd {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1000rpx;
    margin-left: -500rpx;
    height: 200rpx;
    transition: all .65s ease;
  }
  .logo {
    position: absolute;
    z-index: 2;
    left: 50%;
    bottom: 200rpx;
    width: 160rpx;
    height: 160rpx;
    margin-left: -80rpx;
    border-radius: 160rpx;
    animation: sway 10s ease-in-out infinite;
    opacity: .95;
  }
  @keyframes sway{
    0% {transform: translate3d(0,20rpx,0) rotate(-15deg); }
    17% {transform: translate3d(0,0rpx,0) rotate(25deg); }
    34% {transform: translate3d(0,-20rpx,0) rotate(-20deg); }
    50% {transform: translate3d(0,-10rpx,0) rotate(15deg); }
    67% {transform: translate3d(0,10rpx,0) rotate(-25deg); }
    84% {transform: translate3d(0,15rpx,0) rotate(15deg); }
    100% {transform: translate3d(0,20rpx,0) rotate(-15deg); }
  }
  .wave {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 0;
    opacity: 0.725;
    height: 260rpx;
    width: 2250rpx;
    animation: wave 10s linear infinite;
  }
  .wave-bg {
    z-index: -1;
    animation: wave-bg 10.25s linear infinite;
  }
  @keyframes wave{
    from {transform: translate3d(125rpx,0,0);}
    to {transform: translate3d(1125rpx,0,0);}
  }
  @keyframes wave-bg{
    from {transform: translate3d(375rpx,0,0);}
    to {transform: translate3d(1375rpx,0,0);}
  }

  .bd {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    animation: bd-rise 2s cubic-bezier(0.23,1,0.32,1) .75s forwards;
    opacity: 0;
    padding-top: 200rpx;
  }
  @keyframes bd-rise{
    from {opacity: 0; transform: translate3d(0,60rpx,0); }
    to {opacity: 1; transform: translate3d(0,0,0); }
  }

  .confirm-btn {
    font-size: 13pt;
    line-height: 85rpx;
    height: 85rpx;
    background: pink;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    margin: 50rpx 3%;
  }
  .confirm-text{
    color: #fff;
  }
  .confirm-btn:active {
    opacity: .8;
  }


</style>
