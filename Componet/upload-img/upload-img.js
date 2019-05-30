// Componet/upload-img/upload-img.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        imgList: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        chooseImg() {
            let { imgList } = this.data
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    const tempFilePaths = res.tempFilePaths
                    imgList = [...imgList, ...tempFilePaths]
                    if (imgList.length > 9) {
                        imgList = imgList.splice(0, 9)
                    }
                    this.setData({
                        imgList
                    })
                    const myEventDetail = { imgList }
                    this.triggerEvent('myevent', myEventDetail)
                }
            })
        },

        // 删除
        deleteTap(e) {
            let { imgList } = this.data
            imgList.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                imgList
            })
            const myEventDetail = { imgList }
            this.triggerEvent('deleteTap', myEventDetail)
        }
    }
})