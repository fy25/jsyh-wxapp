import {
    AddPoint
} from "../../service/addPoint"
import {
    Config
} from "../../utils/config"
const addPoint = new AddPoint()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Config,
        publicList: [{
                value: 0,
                label: "公司部"
            },
            {
                value: 1,
                label: "零售部"
            },
        ],
        publicTextList: ["公司部", "零售部"],
        index: 0,
        isPublic: '',
        begin_date: '',
        end_date: '',
        bug_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBugId()
    },

    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value.join(','))
        this.data.bug_id = e.detail.value.join(',')
    },

    publicTap(e) {
        let {
            publicList
        } = this.data
        console.log(e.detail.value)
        this.setData({
            publicIndex: e.detail.value,
            isPublic: publicList[e.detail.value].value
        })
    },

    getBugId: function() {
        addPoint.getBugId({
            action: 'get_user_group_index'
        }).then(res => {
            let {
                branchTextList
            } = this.data
            this.data.branchList = res
            if (res.length != 0) {
                console.log(res)
                    // res.forEach(item => {
                    //     branchTextList.push(`${item.USERGROUP_CODE}${item.USERGROUP_NAME}`)
                    // })
            }
            this.setData({
                // branchTextList: branchTextList
                branchlist: res
            })
        })
    },

    // 开始时间
    beginChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            begin_date: e.detail.value
        })
    },

    // 结束时间
    endChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            end_date: e.detail.value
        })
    },

    goWhere(e) {
        let { begin_date, end_date, isPublic, bug_id } = this.data
        wx.reLaunch({
            url: `${e.currentTarget.dataset.path}?begin_date=${begin_date}&end_date=${end_date}&isPublic=${isPublic}&bug_id=${bug_id}`
        })
    }
})