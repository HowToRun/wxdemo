<template>
  <div class='div_bg'>
    <div v-for="img in imgData">

      <div class="img">
        <image @click="previewImage" :data-src=img.imgUrl mode="aspectFill" class='image_style' :src=img.imgUrl></image>
      </div>
      <div class='text'>
        <text style="width: 294.5px;  font-family: guiqi; border-color: rgb(0, 0, 0); border-style: none; border-radius: 0px; font-style: normal; font-weight: normal; text-align: center; color: rgb(100, 60, 27); font-size: 13px; line-height: 1.5; box-shadow: black 0px 0px 0px; letter-spacing: 0px; top: 0px; left: 0px;">{{ img.desc }}</text>
      </div>
    </div>

  </div>
</template>

<script>
// Use Vuex
import store from './store'
import api from '@/api/api.js'
import app from '@/App'
export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  data () {
    return {
      imgUrlsDefaultPre: [
      ],
      imgData: [
      ]
    }
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    },
    previewImage: function (e) {
      var that = this
      // 图片详情中点击图片浏览大图方法
      // 获取页面src中的query参数
      var options = this.$root.$mp.query
      // 获取当前点击的图片的src
      let imgSrc = e.currentTarget.dataset.src
      console.log(options.id)
      console.log(imgSrc)
      // 测试数据
      wx.previewImage({
        // 当前显示图片的http链接
        current: imgSrc,
        // 需要预览的图片http链接列表
        urls: that.imgUrlsDefaultPre
      })
    }
  },
  onLoad: function () {
    var that = this
    var options = this.$root.$mp.query
    wx.request({
      url: api.mobileIn + 'getDetailImage',
      method: 'GET',
      data: {
        openId: app.globalData.openId,
        id: options.id

      },
      success: function (res) {
        that.imgData = res.data.data.list
        that.imgUrlsDefaultPre = res.data.data.srcList
      }
    })
  }
}
</script>

<style>
  /* pages/home/gridview/gridview.wxss */
  .view_bg {
    height: 100%;
    width: 100%;
    background-size: cover;
    /*background: url('https://pengmaster.com/party/wechat/marry/background/fenhong.jpg') no-repeat center; */
  }
  .edit_bg{
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 10px;
    margin-top: 10px;
  }
  .img {
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .add_ic{
    width: 60px;
    height: 60px;
    position:fixed;
    bottom:0;
    right: 0;
    margin: 10px;
  }
  .text {
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .image_style {
    width: 95%;
    margin: 0, auto;
    animation: move 5s;
    opacity: 0;
    display: block;
    animation-fill-mode: forwards;
    background-size: cover;
  }

  @keyframes move {
    from {
      scale: 0.5;
      opacity: 0;
    }

    to {
      scale: 1;
      opacity: 1;
    }
  }

  .text_style {
    font-size: 12px;
    margin-top: 10px;
  }

  /*细线 */

  .line {
    margin-top: 10px;
    height: 2rpx;
    background-color: gainsboro;
  }
  .modal-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 9000;
    color: #fff;
  }
  .modal-dialog {
    width: 540rpx;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    background: #fff;
    margin: -180rpx 105rpx;
    border-radius: 36rpx;
  }
  .modal-title {
    padding-top: 50rpx;
    font-size: 36rpx;
    color: #030303;
    text-align: center;
  }
  .modal-content {
    padding: 50rpx 32rpx;
  }
  .modal-input {
    display: flex;
    background: #fff;
    border-bottom: 2rpx solid #ddd;
    border-radius: 4rpx;
    font-size: 28rpx;
  }
  .input {
    width: 100%;
    height: 82rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    color: #333;
  }
  input-holder {
    color: #666;
    font-size: 28rpx;
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    height: 86rpx;
    border-top: 1px solid #dedede;
    font-size: 34rpx;
    line-height: 86rpx;
  }
  .btn-cancel {
    width: 50%;
    color: #666;
    text-align: center;
    border-right: 1px solid #dedede;
  }
  .btn-confirm {
    width: 50%;
    color: #ec5300;
    text-align: center;
  }
</style>
