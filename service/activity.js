import { Base } from "../utils/base"

class Activity extends Base {
    constructor() {
        super()
    }

    // 添加标记
    getCode(data) {
        return this.post({
            url: `/ajax/Com_PCInfo.ashx`,
            data: data
        })
    }


    //查看活动
    getAct(data){
      return this.post({
        url: `/ajax/Com_PCInfo.ashx`,
        data: data
      })
    }
}

export { Activity }