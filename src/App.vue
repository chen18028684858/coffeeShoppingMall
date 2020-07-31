<template>
  <div id="app">
    
    <router-view />
  </div>
</template>


<style lang="less">
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.auto_img{
  width: 100%;
  display: block;
}
#app{
  @background-color: #70432e;
}
.one_text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
body{
  background-color: #f0f0f0;
}
</style>
