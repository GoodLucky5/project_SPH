<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口（具体展示在哪个位置 -->
    <router-view></router-view>
    <!-- footer仅在home，search中显示 -->
    <Footer v-show="$route.meta.isShow"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",
  data() {
    return {
      msg:'abc'
    }
  },
  components: { Header, Footer },
  mounted() {
    this.$store.dispatch("categoryList")
  },
};
</script>

<style>
</style>
