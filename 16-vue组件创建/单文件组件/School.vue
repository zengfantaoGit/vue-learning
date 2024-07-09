<!--
        该组件文件只支持 template,script,style标签
-->

<template>
  <!--  组件文件的html代码，必须只有一个根节点-->
  <div>
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
    <button @click="show">点击</button>
  </div>
</template>

<script>
//组件文件的交互代码
<!--    生成一个组件Vue.extend-->
// 默认暴露，此时可以省略Vue.extend()方法
export default {
  // 名称一般与文件名一致
  name: 'School',
  data() {
    return {
      name: '牛魔',
      address: '是单独收费'
    }
  },
  methods: {
    show() {
      alert(1)
    }
  }
}
</script>

<style>
/*组件文件的样式*/
</style>