"use strict";(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[515],{9515:function(t,s,a){a.r(s),a.d(s,{default:function(){return d}});var n=function(){var t=this,s=t._self._c;return s("div",{staticClass:"home"},[s("div",{staticClass:"main-container main-container-signinup overflow-default-hidden"},[t._m(0),s("div",{staticClass:"signinup_container"},[s("form",{staticClass:"signinup_form_wrapper"},[s("div",{staticClass:"mb-3"},[s("label",{staticClass:"form-label",attrs:{for:"signin_account"}},[t._v("Account")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.account,expression:"account"}],staticClass:"form-control",attrs:{type:"text",id:"signin_account",required:""},domProps:{value:t.account},on:{input:function(s){s.target.composing||(t.account=s.target.value)}}})]),s("div",{staticClass:"mb-3"},[s("label",{staticClass:"form-label",attrs:{for:"signin_password"}},[t._v("Password")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"form-control",attrs:{type:"password",id:"signin_password",required:""},domProps:{value:t.password},on:{input:function(s){s.target.composing||(t.password=s.target.value)}}})])]),s("button",{staticClass:"btn btn-primary",attrs:{type:"button"},on:{click:t.submitSignin}},[t._v("Submit")]),s("div",{staticClass:"signinup_link_wrapper"},[s("router-link",{attrs:{to:"/signup"}},[t._v(" 註冊 ")])],1)])])])},i=[function(){var t=this,s=t._self._c;return s("div",{staticClass:"title-wrapper"},[s("h1",[t._v("Signin")])])}],r=(a(1703),a(7877)),o=a(6163),e={data(){return{account:"",password:""}},methods:{async submitSignin(){try{if(!this.account||!this.password)return void o.F.fire({icon:"warning",title:"Account、Password 不可空白"});const t={account:this.account,password:this.password},s=await r.Z.signin({formData:t});if("success"!==s.data.status)throw this.password="",new Error(s.data.message);localStorage.setItem("token",s.data.token),this.$store.commit("setCurrentUser",s.data.user),this.$router.push("/")}catch(t){console.warn(t),o.F.fire({icon:"warning",title:t})}}}},c=e,u=a(1001),l=(0,u.Z)(c,n,i,!1,null,null,null),d=l.exports}}]);
//# sourceMappingURL=515.90791112.js.map