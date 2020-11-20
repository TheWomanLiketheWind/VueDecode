
## 解读 Vue 响应式源码, 并实现 小型 Vue响应式功能


### `new Vue() 做了哪些事情`
1. 调用属性保存选项的数据
2. 把data中的成员转换成getter 和setter，注入到Vue实例中
3. 调用observers 对象，监听数据的变化
4. 调用compiler对象，解析指令和差值表达式

### `如何实现响应式功能`
1. observer 中通过 Object.defineProperty 中的 get, set 方法进行 【 获取 】和【 修改 】data中的值

### `模版的解析`
1. 获取 '#app' 内所有的子节点，将子节点中的 v-, {{}}, @，进行解析并转换

### `待定`
