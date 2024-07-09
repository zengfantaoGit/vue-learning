// 入口文件，生成对应的Vue实例对象

import App from './App.vue'
const vm = new Vue({
    el: '#root',
    components: {
        App
    },
    // 生成模板组件
    template: `<App></App>`
})