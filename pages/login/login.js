import { Login } from "../../service/login"
import util from "../../utils/util"
import { Config } from "../../utils/config"
const loginApi = new Login()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: null,
        pwd: null,
        Config
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    // 登录
    signIn() {
        let { name, pwd, Config } = this.data
        if (name == null) {
            util.toust('请输入工号')
        } else if (pwd == null) {
            util.toust('请输入密码')
        } else {
            wx.showLoading({ title: '正在登录' })
            this.getCode(name).then(res => {
                let data = {
                    action: 'get_user_info',
                    name: name,
                    pwd: pwd,
                    code: res
                }
                loginApi.signIn(data).then(res => {
                    let ISPUBLIC = null;
                    let IS_ALL = null;
                    let { retailKey, adminKey, retailId, corporateId } = Config
                    let userid = res.USER_ID
                    let { USERGROUP_ID } = res
                    if (adminKey.indexOf(userid) != -1) {
                        ISPUBLIC = ''
                        IS_ALL = '1'
                    } else if (retailId.indexOf(userid) != -1) {
                        ISPUBLIC = '1'
                        IS_ALL = '1'
                    } else if (corporateId.indexOf(userid) != -1) {
                        ISPUBLIC = '0'
                        IS_ALL = '1'
                    } else {
                        IS_ALL = '0'
                        if (retailKey.indexOf(USERGROUP_ID) != -1) {
                            console.log('零售部')
                            ISPUBLIC = '1'
                        } else {
                            ISPUBLIC = '0'
                        }
                    }
                    res.ISPUBLIC = ISPUBLIC
                    res.IS_ALL = IS_ALL
                    let userinfo = JSON.stringify(res)
                    wx.setStorageSync('userinfo', userinfo)
                    console.log(userinfo, "99999999999")

                    wx.redirectTo({ url: `/pages/map/map` })
                })
            })
        }
    },

    inputTap(e) {
        let { category } = e.currentTarget.dataset
        let value = e.detail.value
        this.setData({
            [category]: value
        })
    },

    // 获取加密字段
    getCode(name) {
        let data = {
            action: 'md_info',
            name: name
        }
        return loginApi.getCode(data)
    }
})