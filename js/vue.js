class Vue {
  constructor(options) {
    // 1. 调用属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把data中的成员转换成getter 和setter，注入到Vue实例中
    this._proxyData(this.$data)
    // 3. 调用observers 对象，监听数据的变化
    new Observer(this.$data)
    // 4. 调用compiler对象，解析指令和差值表达式
    new Compiler(this)
  }

  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newVue) {
          if (newVue === data[key]) {
            return
          }
          data[key] = newVue
        }
      })
    })
  }
}