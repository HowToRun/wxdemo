<template>
  <div>
  <div class='textpp'>选择照片:</div>
  <div class='photo'>
    <span v-for="item in imgData">
      <image class='ph' :src=item></image>
    </span>
    <image @click="chooseImg" class='ph' :src=imgUrlsDefaultPre[0]></image>
  </div>
  <div class='text'>图片描述可进入图集逐一修改</div>
    <input
      type="button" value="上传" @click="uploadImg">
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
      openId: app.globalData.openId,
      imgUrlsDefaultPre: [
        '/static/images/waitUpload.jpg'
      ],
      imgData: [
      ],
      bannerCode: ''
    }
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    },
    uploadImg: function () {
      console.log('upload')
      const that = this
      console.log(that.imgData[0])
      wx.showLoading({
        title: '照片正在上传中。。。 ',
        mask: true
      })
      console.log('bannerCode' + this.bannerCode)
      if (this.bannerCode === '') {
        this.uploadImgWithoutBanner()
      } else {
        this.uploadImgWithBanner()
      }
      wx.hideLoading()
      wx.showModal({
        title: '上传成功',
        showCancel: false,
        complete: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    uploadImgWithBanner () {
      const that = this
      for (let i = 0; i < that.imgData.length; i++) {
        wx.uploadFile({
          url: api.host + 'image/imgUpload?&bannerCode=' + that.bannerCode,
          filePath: that.imgData[i],
          name: 'file',
          header: { 'Content-Type': 'multipart/form-data' },
          success: function (res) {
            let data = JSON.parse(res.data)
            console.log(data.data)
          }
        })
      }
    },
    uploadImgWithoutBanner () {
      const that = this
      wx.uploadFile({
        url: api.host + 'image/imgUpload?flag=0',
        filePath: that.imgData[0],
        name: 'file',
        header: { 'Content-Type': 'multipart/form-data' },
        success: function (res) {
          let data = JSON.parse(res.data)
          that.bannerCode = data.data
          if (that.imgData.length > 2) {
            that.uploadDetailImg()
          }
          console.log(data.data)
        }
      })
    },
    uploadDetailImg: function () {
      const that = this
      for (let i = 1; i < that.imgData.length; i++) {
        wx.uploadFile({
          url: api.host + 'image/imgUpload?&bannerCode=' + that.bannerCode,
          filePath: that.imgData[i],
          name: 'file',
          header: { 'Content-Type': 'multipart/form-data' },
          success: function (res) {
            let data = JSON.parse(res.data)
            console.log(data.data)
          }
        })
      }
    },
    chooseImg: function () {
      const that = this
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths
          that.imgData.push.apply(that.imgData, tempFilePaths)
        }
      })
    }
  },
  onShow: function () {
    this.imgData = []
    let options = this.$root.$mp.query
    console.log('options.id======>' + options.id)
    if (options.id === undefined) {
      console.log('options.id======>' + false)
    } else {
      console.log('options.id======>' + true)
      this.bannerCode = options.id
    }
  },
  onLoad: function () {
  }
}
</script>

<style>
  .photo {
    display: flex;
    margin-top: 10px;
    width:100%;
    flex-wrap: wrap;
  }

  .ph {
    /*float:left;*/
    border: 1px    dashed #909090;
    margin-right: 15px;
    width: 100px;
    height: 80px;
  }
  .phzz {
    border: 1px    dashed #909090;
    margin-right: 70px;
    margin-left: 70px;
    width: 100px;
    height: 60px;
  }
  .phright{

    border: 1px dashed #909090;
    margin-left: 20px;
    width: 80px;
    height: 60px;
  }
  .textp{
    margin-left: 70px;
    font-size: 14px;
  }
  .text{
    margin-left: 25px;
    font-size: 14px;
  }
  .text2{
    margin-left: 80px;
    font-size: 14px;
  }
  .text3{
    margin-left: 98px;
    font-size: 14px;
  }
</style>
