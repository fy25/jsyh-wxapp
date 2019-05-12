import { Base } from "../utils/base"

class Add extends Base {
  constructor() {
    super()
  }

  //添加活动
  addAct(data) {
    return this.post({
      url: `/ajax/Com_PCInfo.ashx`,
      data: data
    })
  }

}

export { Add }