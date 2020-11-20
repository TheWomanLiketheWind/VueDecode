class Observer {
  constructor(data) {
    this.walk(data)
  }
  /** 遍历对象的所有属性 */
  walk(data) {
    //  1. 判断data是否是对象
    if (!data || typeof data !== 'object') return

    // 遍历对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  /** */
  defineReactive(obj, key, val) {
    let that = this
    // 如果val是对象, 把val内部的属性转化为响应式数据
    that.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return val
      },
      set(newVal) {
        if (newVal === val) return
        val = newVal
        // 当data中重新赋值的时候，将属性变为响应式数据
        that.walk(newVal)
        // 发送通知
      }
    })
  }
}