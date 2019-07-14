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
                label: "公司业务部"
            },
            {
                value: 1,
                label: "零售业务部"
            },
            {
                value: "",
                label: "公司业务部和零售业务部"
            },
        ],
        publicTextList: ["公司业务部", "零售业务部", "公司业务部和零售业务部"],
        publicIndex: "",
        isPublic: '',
        begin_date: '',
        end_date: '',
        bug_id: '',
        name: '',
        checkAll: false,
        nameList: [],
        nameIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBugId()
        this.getAllName()
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

    nameTap(e) {
        let { nameList } = this.data;
        console.log(nameList[e.detail.value])
        this.setData({ nameIndex: e.detail.value })
        this.data.name = nameList[e.detail.value]
    },

    nameInput(e) {
        console.log(e)
        this.data.name = e.detail.value
    },

    getBugId: function() {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        let bug_id = JSON.parse(wx.getStorageSync('userinfo')).USERGROUP_ID
        addPoint.getBugId({
            action: 'get_user_group_index',
            user_id: userid,
            bug_id: bug_id
        }).then(res => {
            this.data.branchList = res
            if (res.length != 0) {
                console.log(res)
                this.setData({
                    branchlist: res
                })
            }
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
        let { begin_date, end_date, isPublic, bug_id, name } = this.data
        if (name == '不筛选标记名') {
            name = ""
        }
        wx.reLaunch({
            url: `${e.currentTarget.dataset.path}?begin_date=${begin_date}&end_date=${end_date}&isPublic=${isPublic}&bug_id=${bug_id}&name=${name}&is_all=1`
        })
    },

    // 清除筛选
    clearFilter(e) {
        wx.reLaunch({
            url: `${e.currentTarget.dataset.path}`
        })
    },

    chooseAll() {
        console.log(this.data.branchlist)
        let { branchlist, checkAll } = this.data
        if (checkAll) {
            branchlist.forEach(item => {
                item.checked = false
            });
            this.data.bug_id = ""
        } else {
            let temp = []
            branchlist.forEach(item => {
                item.checked = true
                temp.push(item.USERGROUP_ID)
            });
            console.log(temp)
            this.data.bug_id = temp.join(",")
        }
        this.setData({
            branchlist,
            checkAll: !checkAll
        })
    },

    // 获取所有标记名称
    getAllName() {
        let userid = JSON.parse(wx.getStorageSync('userinfo')).USER_ID
        let bug_id = JSON.parse(wx.getStorageSync('userinfo')).USERGROUP_ID
        addPoint.getBugId({
            action: 'get_sign_index',
            pageIndex: '1',
            pageSize: '100',
            is_all: '0',
            user_id: userid,
            bug_id: bug_id,
            begin_date: "",
            end_date: "",
            ispublic: "",
            name: ""
        }).then(res => {
            console.log(res)
            let nameList = []
            res.forEach(item => {
                nameList.push(item.SIGN_NAME)
            })
            nameList.unshift('不筛选标记名')
            this.setData({ nameList })
        })
    }

})