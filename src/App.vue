<template>
  <div id="app">
    
    <keep-alive include="Search,Classify,Home,ProCategory">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
body {
  background: #f2f2f2;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
