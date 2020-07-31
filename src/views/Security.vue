<template>
  <div class="security">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="pop_box">
      <van-cell is-link @click="showPopup">修改密码</van-cell>
      <van-popup v-model="show" position="bottom">
        <div class="pop_item">
        
          <van-form @submit="changePwd">
            <van-field
              v-model="passwords.oldPwd"
              label="旧密码"
              placeholder="请输入旧密码"
            />
            <van-field
              v-model="passwords.password"
              type="text"
              label="新密码"
              placeholder="请输入新密码"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">
                提交
              </van-button>
            </div>
          </van-form>

        </div>
      </van-popup>
      
      <van-cell is-link @click="destroy" >注销账号</van-cell>

      <div>
        <van-button class="btn_box" type="warning" @click="outLogin">退出登录</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import validForm from "../assets/js/validForm.js";
  export default {

    data(){
      return {
        show: false,
        passwords:{
          password:'',
          oldPwd:'',
        }
      }
    },

    created(){

    },

    methods:{

      //返回
      goBack(){
        this.$router.go(-1);
      },

      //弹出修改密码输入框
      showPopup() {
        this.show = true;
      },

      //修改密码
      changePwd(){

        if (!validForm.validUserForm(this.passwords)) {
          return;
        }

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:'/updatePassword',
          data:{
            appkey:this.appkey,
            tokenString,
            //新的密码
            password: this.passwords.password,
            //旧密码
            oldPassword: this.passwords.oldPwd

          }
        }).then(result => {
          this.$toast.clear();
          this.show = false
          if(result.data.code == 'E001'){
            //清除token
            localStorage.removeItem('__tnek');
            this.$router.push({name:'Login'})
          }else{
            this.$toast(result.data.msg)
          }
        }).catch(err => {
          this.$toast.clear();
        })
      },

      //退出登录
      outLogin(){
        localStorage.removeItem('__tnek');
        this.$router.push({name:'Login'})
      },

      //注销
      destroy(){
        this.$dialog.confirm({
          title:'注销账号',
          message:'一旦注销，数据无法恢复'
        }).then(() => {
          let tokenString = localStorage.getItem("__tnek");

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          }).then(result => {
              this.$toast.clear();

              if (result.data.code == 'G001') {
                //清除token
                localStorage.removeItem('__tnek');
                this.$router.push({name: 'Login'});
              } else {
                this.$toast(result.data.msg);
              }

            }).catch(err => {
              this.$toast.clear();
            });
        }).catch(err => {
          
        });

      }


    }
  }
</script>

<style lang="less" scoped>

.security{
  .pop_box{
    margin-top: 20px;
    padding: 0 10px;
  }
  .pop_item{
    padding: 10px;
  }
  .van-cell{
    margin-bottom: 20px;
  }
  .btn_box{
    width: 100%;
    margin-top: 50px;
  }
}

</style>