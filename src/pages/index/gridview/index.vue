<template>
  <div class='div_bg'>
    <div v-show=isAdmin>
      <input
        type="button" value="上传照片" @click="chooseImg">
    </div>
    <div v-for="img in imgData">

      <div class="img">
        <image @click="previewImage" :data-src=img.imgUrl mode="aspectFill" class='image_style' :src=img.imgUrl></image>
      </div>
      <div class='text'>
        <text style="width: 294.5px;  font-family: guiqi; border-color: rgb(0, 0, 0); border-style: none; border-radius: 0px; font-style: normal; font-weight: normal; text-align: center; color: rgb(100, 60, 27); font-size: 13px; line-height: 1.5; box-shadow: black 0px 0px 0px; letter-spacing: 0px; top: 0px; left: 0px;">{{ img.desc }}</text>
        <input @click="tapSendTele" :data-code=img.code style="font-size: 24rpx;" type="button" value="编辑" v-show=isAdmin>
        <!--<input @click="tapSendTele" :data-code=img.code style="font-size: 24rpx;" type="button" value="删除" v-show=isAdmin>-->
      </div>
    </div>
    <!--填写描述弹框-->
    <div class="modalMask" v-if="isModel"></div>
    <div class="modalDialog" v-if="changeModel">
      <div class="modalContent">
        <p class="contentTip">输入图片描述</p>
        <input type="number" placeholder="输入图片描述" class="teleStyle" v-model="imgDesc">
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel">取消</div>
        <div class="btnConfirm" @tap="confirmSend">确定发送</div>
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
      isAdmin: app.globalData.isAdmin,
      currentCode: '',
      changeModel: false,
      isModel: false,
      imgDesc: '',
      openId: app.globalData.openId,
      imgUrlsDefaultPre: [
      ],
      imgData: [
      ],
      adminOpenId: app.globalData.adminOpenId
    }
  },
  methods: {
    chooseImg () {
      let options = this.$root.$mp.query
      wx.navigateTo({
        url: '../upload/main?id=' + options.id
      })
    },
    getData () {
      const that = this
      let options = this.$root.$mp.query
      wx.request({
        url: api.mobileIn + 'getDetailImage',
        method: 'GET',
        data: {
          openId: app.globalData.openId,
          id: options.id

        },
        success: function (res) {
          if (res.data.data.list.length === 0) {
            wx.showModal({
              title: '图集内容为空',
              content: '当前图集中无照片，等待管理员上传'
            })
          }
          that.$set(that, 'imgData', res.data.data.list)
          that.$set(that, 'imgUrlsDefaultPre', res.data.data.srcList)
          console.log(that.imgData)
          // that.imgData = res.data.data.list
          // that.imgUrlsDefaultPre = res.data.data.srcList
        }
      })
    },
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    },
    // 打开输入描述的模态框
    tapSendTele (e) {
      this.changeModel = !this.changeModel
      this.isModel = !this.isModel
      // 将当前编辑的图片code提到公共状态供其他函数选择
      let code = e.currentTarget.dataset.code
      this.currentCode = code
      console.log(this.currentCode)
    },
    //  弹框取消
    tapCancel () {
      this.phoneNumber = ''
      this.changeModel = !this.changeModel
      this.isModel = !this.isModel
      // 将当前图片的code记录清除
      this.currentCode = ''
      console.log(this.currentCode)
    },
    //  确认发送
    confirmSend () {
      const that = this
      console.log(this.imgDesc)
      // 发送请求修改描述
      wx.request({
        url: api.host + 'image/updateDesc',
        method: 'POST',
        data: {
          desc: that.imgDesc,
          code: that.currentCode
        },
        success: function (res) {
          that.getData()
        }
      })
      // 隐藏模态框
      this.changeModel = !this.changeModel
      this.isModel = !this.isModel
      // 将当前图片的code记录清除
      this.imgDesc = ''
      this.currentCode = ''
    },
    showEditModo: function () {
      const that = this
      that.isHidden = true
    },
    previewImage: function (e) {
      const that = this
      // 图片详情中点击图片浏览大图方法
      // 获取页面src中的query参数
      let options = this.$root.$mp.query
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
  onShow: function () {
    const that = this
    that.getData()
    // 验证当前用户是否具有管理员权限
    wx.request({
      url: api.mobileIn + 'isAdmin',
      method: 'GET',
      data: {
        openId: app.globalData.openId
      },
      success: function (res) {
        that.isAdmin = res.data.data
        console.log('isAdmin:' + res.data.data)
      }
    })
  },
  onLoad: function () {
    this.getData()
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
  .modalMask {
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
  .modalDialog {
    box-sizing: border-box;
    width: 560rpx;
    /*height: 330 px;*/
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    background: #fff;
    margin: -180rpx 95rpx;
    border-radius: 8rpx;
  }
  .modalContent {
    box-sizing: border-box;
    display: flex;
    padding: 50rpx 53rpx;
    font-size: 36rpx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .contentTip{
    text-align: center;
    font-size: 36rpx;
    color: #333333;
  }
  .teleStyle{
    background: #FFFFFF;
    border: 1rpx solid #979797;
    border-radius: 6rpx;
    line-height: 50rpx;
    height: 50rpx;
    box-sizing: border-box;
    padding-left: 12rpx;
    width: 460rpx;
    font-size: 28rpx;
    /*color: rgba(0,0,0,0.25);*/
    margin-top: 30rpx;
  }
  .modalFooter {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 100rpx;
    border-top: 1rpx solid #E5E5E5;
    font-size: 36rpx;
    line-height: 100rpx;
  }
  .btnCancel {
    width: 50%;
    font-size: 36rpx;
    color: #333;
    text-align: center;
    border-right: 1rpx solid #E5E5E5;
    }
  .btnConfirm {
    font-size: 36rpx;
    width: 50%;
    color: #508CEE;
    text-align: center;
  }

</style>
