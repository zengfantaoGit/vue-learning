<template>
  <div>
    <School></School>
    <Student></Student>
  </div>
</template>

<script>
//从外层组件文件引入对象
import School from "./School.vue"
import Student from "./Student.vue";
export default {
  // 这个文件用于管理其他的组件，将会向Vue实例提供接口
  name: "App",
  // 注册对应组件
  components:{
    School,
    Student
  }
}
</script>

<style scoped>

</style>