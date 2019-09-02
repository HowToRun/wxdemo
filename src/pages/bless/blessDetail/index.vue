<template>
  <div class="container">
    <div class="bless_img">
      <image src="/static/images/mail.png"/>
    </div>
    <div class="title">已收到 {{blessDataAll.length}} 位好友的祝福</div>
    <div class="title"> 点击下方按钮可送上祝福 </div>

    <div  class="friends">
      <div v-for="item in blessDataAll" bindtap='loadMoreFriends' class="face">
        <image :src=item.avatarUrl /></div>
    </div>
    <div class="btn_zone">
      <div class="zan fl">
        <button type="primary" @click='zan'>送上祝福</button>
      </div>
      <div class="share fr">
        <button type="default" open-type="share">分享</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index'
import card from '@/components/card'
import api from '@/api/api.js'
import app from '@/App'
export default {
  components: {
    card
  },

  data () {
    return {
      inputValue: '',
      logs: [],
      blessDataAll: [
      ],
      blessDataLess: [
      ],
      commentData: [
      ]
    }
  },
  methods: {
    testfoo: function () {
      console.log('testfoo')
      console.log(this.inputValue)
    },
    loadMoreFriends: function (e) {
      wx.navigateTo({
        url: 'blessDetail/blessDetail'
      })
    },
    zan: function (event) {
      const that = this
      wx.request({
        url: api.mobileIn + 'doPraise',
        data: {
          'openId': app.globalData.openId
        },
        method: 'GET',
        dataType: 'json',
        success: res => {
          if (res.statusCode === 200) {
            console.log(res.data)
            that.getPraiseList()
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          }
        }
      })
    },
    getPraiseList: function () {
      const that = this
      wx.request({
        url: api.mobileIn + 'getPraise',
        method: 'GET',
        success: function (res) {
          that.blessDataAll = res.data.data
          if (that.blessDataAll.length > 10) {
            that.blessDataLess = that.blessDataAll.slice(0, 10)
          } else {
            that.blessDataLess = that.blessDataAll
          }
          console.log('praise info', res.data.data)
        }
      })
    },
    getCommentList: function () {
      const that = this
      wx.request({
        url: api.mobileIn + 'getComment',
        method: 'GET',
        success: function (res) {
          that.commentData = res.data.data
          console.log('getComment info', res.data.data)
        }
      })
    },
    foo: function () {
      const that = this
      if (that.inputValue) {
        // 留言内容不是空值
        let words = that.inputValue
        console.log(words)
        console.log(app.globalData.openId)
        wx.request({
          url: api.mobileIn + 'doComment',
          data: {
            'comment': words,
            'userOpenId': app.globalData.openId
          },
          method: 'POST',
          dataType: 'json',
          success: res => {
            if (res.statusCode === 200) {
              console.log(res.data)
              that.getCommentList()
              wx.showModal({
                title: '提示',
                content: res.data,
                showCancel: false
              })
            }
          }
        })
      } else {
        // Catch Error
        wx.showModal({
          title: '提示',
          content: '您还没有填写内容',
          showCancel: false
        })
      }
      that.inputValue = ''
    }
  },
  created () {
  },
  onLoad: function () {
    const that = this
    wx.request({
      url: api.mobileIn + 'getPraise',
      method: 'GET',
      success: function (res) {
        that.blessDataAll = res.data.data
        if (that.blessDataAll.length > 10) {
          that.blessDataLess = that.blessDataAll.slice(0, 10)
        } else {
          that.blessDataLess = that.blessDataAll
        }
        console.log('praise info', res.data.data)
      }
    })
    wx.request({
      url: api.mobileIn + 'getComment',
      method: 'GET',
      success: function (res) {
        that.commentData = res.data.data
        console.log('getComment info', res.data.data)
      }
    })
  }
}
</script>

<style>
  /* pages/bless/index.wxss */
  .title {
    text-align: center;
    font-size: 30rpx;
    line-height: 60rpx;

  }
  .hide {
    display: none;
  }

  .show {
    display: block;
  }
  .edit_bg{
    z-index:200;
    left: 90%;
    top: 25%;
    position: absolute;
    text-align: right;
  }
  .friends {
    height: auto;
    min-height: 0;
    overflow: hidden;
    width: 600rpx;
    margin: 0 auto;
    margin-top: 20rpx;
  }
  .load_more_friends_arrow{
    right: 20px;
    position: absolute;
    top: 70px;
    width: 5px;
    height: 15px;
  }
  .friends_view{
    width: 100%;
    display: flex;
    text-align: center
  }
  .face {
    width: 100rpx;
    height: 100rpx;
    float: left;
    margin: 10rpx;
  }
  .face image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
  .btn_zone {
    padding: 30rpx 50rpx;
    border-top: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
    min-height: 0;
    overflow: hidden;
    margin-top: 20rpx;
    display: flex
  }
  .zan {
    width: 300rpx;
    background: #CD96CD;
    color: white
  }
  .share {
    width: 300rpx;
    margin-left: 20px;
  }
  .bless_img {
    width: 400rpx;
    height: 300rpx;
    margin: 0 auto;
  }

  .bless_img image{
    width: 400rpx;
    height: 300rpx;
  }
  .tips {
    text-align: center;
    font-size: 25rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    color: #ccc;
  }

  /* pages/chat/index.wxss */
  .container{
    background-color: #f1f2f7;
  }
  page {
    background-color: #f1f2f7;
    padding-bottom: 150rpx;
  }
  .chat_view{
    margin-bottom: 180rpx;
  }
  .chat_list {
    width: 630rpx;
    margin: 0 auto;
    margin-top: 30rpx;
    padding: 30rpx;
    min-height: 0;
    overflow: hidden;
    background-color: #f1f2f7;
    border-radius: 5px;
    box-shadow:  0 0 20px rgba(190,77,43,.2);
  }
  .chat_face {
    width: 100rpx;
    height: 100rpx;
    float: left;
    margin-right: 30rpx;
    margin-top: 30rpx;
  }
  .chat_face image{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
  .chat_words {
    width: 500rpx;
    float: left;
    font-size: 30rpx;
    line-height: 50rpx;
    color: #999;
  }
  .chat_meta {
    width: 100%;
    min-height: 0;
    overflow: hidden;
    margin-bottom: 10rpx;
  }
  .chat_user {
    display: inline-block;
    font-size: 30rpx;
    font-weight: 600;
    color: #666;
    float: left;
  }
  .chat_date {
    display: inline-block;
    font-size: 24rpx;
    color: #ccc;
    float: right;
  }

  .send_msg {
    width: 700rpx;
    padding: 25rpx;
    background-color: #fff;
    min-height: 0;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;

  }
  .send_ipt {
    width: 500rpx;
    padding: 10rpx;
    font-size: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    float: left;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .send_btn {
    width: 150rpx;
    height: 80rpx;
    font-size: 36rpx;
    line-height: 80rpx;
    float: right;
    background: #CD96CD;
    color: white
  }

  .befirst {
    width: 600rpx;
    height: 450rpx;
    margin: 0 auto;
    min-height: 0;
    overflow: hidden;
    margin-top: 200rpx;
  }
  .befirst image{
    width: 600rpx;
    height: 450rpx;
  }
  .text {
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
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
