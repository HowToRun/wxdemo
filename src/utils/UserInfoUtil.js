import api from '@/api/api.js'
import app from '@/App'

function saveUser () {
  wx.request({
    url: api.mobileIn + 'saveUser',
    method: 'GET',
    header: {
      method: 'SAVE_USER'
    },
    data: {
      openId: app.globalData.openId,
      userInfo: app.globalData.userInfo

    },
    success: function (res) {
      if (res.data.code === '000000') {
        // 记录登陆标记
        app.globalData.isLogin = true
        console.log('saveUser successed')
      }
    }
  })
}

export function getUserInfo () {
  console.log('getUserInfo')
  wx.getUserInfo({
    success: function (e) {
      if (e.errMsg === 'getUserInfo:ok') {
        console.log('获取用户信息成功')
        app.globalData.userInfo = e.rawData
        console.log(app.globalData.userInfo)
        saveUser()
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
}
export default {
  getUserInfo,
  saveUser
}
