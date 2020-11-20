class Compiler {
  constructor(vm) {
    // el vue构造函数ob 传来的元素，也就是模版
    this.el = vm.$el
    // vm vue 实例
    this.vm = vm
    // 编译模版
    this.compile(this.el)
  }
  // 编译模版，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes

    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }
      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      let key = attr.value

      // 判断是否是指令 
      if (this.isDirective(attrName)) {
        // 是否指令中是v-on事件
        if (this.isSemicolon(attrName)) {
          let attrIndex = attrName.search(':')
          let attrNames = attrName.substring(2, attrIndex)
          let evenType = attrName.substr(attrIndex + 1)
          this.update(node, this.vm.$options.methods[key], attrNames, evenType)
        } else {
          attrName = attrName.substr(2)
          this.update(node, this.vm[key], attrName)
        }
      } else if (this.isSimpleDirective(attrName)) {
        // 判断是否是v-on简写@事件
        let attrIndex = attrName.search('@')
        let attrNames = 'on'
        let evenType = attrName.substr(attrIndex + 1)
        this.update(node, this.vm.$options.methods[key], attrNames, evenType)
      }
    })
  }
  /**处理不同指令调用不同的接口  */
  update(node, value, attrName, evenType) {
    const updateFn = this[`${attrName}Updater`]
    updateFn && updateFn(node, value, evenType)
  }

  /** 处理 v-text 指令 */
  textUpdater(node, value) {
    node.textContent = value
  }

  /** 处理 v-model 指令 */
  modelUpdater(node, value) {
    node.value = value
  }

  /**处理 v-html指令 */
  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  /**处理 v-on指令 */
  onUpdater(node, value, evenType) {
    node.addEventListener(evenType, value)
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    /**
     * {{ msg }}
     * @param `{{}}` 花括号是固定的形式，但花括号在正则表达式中有特殊含义，则需要用\来转译符来取消
     * @param . 匹配单个但任意字符，不包括换行
     * @param + 匹配前面修饰但内容，出现多次
     * @param ? 尽可能早的结束这个匹配
     * @param () 
     * @param EegExp 具体可查看以下详情 
     *        https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n
     * */
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }
  isSemicolon(attrName) {
    return attrName.search(':') >= 0
  }
  // 判断元素属性是否是简写指令
  isSimpleDirective(attrName) {
    return attrName.startsWith('@')
  }
  //判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}