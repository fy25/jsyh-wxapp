import { Base } from "../utils/base"

class AddPoint extends Base {
  constructor() {
    super()
  }

  //添加标点
  addMarker(data) {
    return this.post({
      url: `/ajax/Com_PCInfo.ashx`,
      data: data
    })
  }

  //获取支行标识
  getBugId(data){
    return this.post({
      url: `/ajax/Com_PCInfo.ashx`,
      data: data
    })
  }

}

export { AddPoint }