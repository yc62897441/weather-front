"use strict";(self["webpackChunkfront"]=self["webpackChunkfront"]||[]).push([[179],{3179:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"home"},[e.isLoading?t("Spinner"):t("WeatherOverview",{staticClass:"WeatherOverview",attrs:{propDatasetOneWeek:e.propDatasetOneWeek}})],1)},n=[],o=(a(1703),a(7877)),r=a(5878),i=a(6005),h=a(6163),d={components:{WeatherOverview:r.Z,Spinner:i.Z},data(){return{dataCategory:{oneWeek:"F-B0053-031",oneWeekDayNight:"F-B0053-033",perThreeHours:"F-B0053-035"},dataType:"JSON",datasetOneWeek:{locations:{location:[]}},propDatasetOneWeek:{},userSave:[],isLoading:!0}},methods:{async fetchDatasetOneWeekAndUserSave(){try{this.isLoading=!0;const e=this.dataCategory.oneWeek,t=this.dataType,a=await o.Z.getWeatherData({dataCategory:e,dataType:t});if(200!==a.status)throw new Error;this.datasetOneWeek={...a.data.dataset};const s=await o.Z.getUserSave();s.data.userSaves&&s.data.userSaves.forEach((e=>{this.userSave.push(e.MountainId)}));const n=[];this.datasetOneWeek.locations.location.forEach((e=>{this.userSave.includes(e.parameterSet.parameter.parameterValue)&&n.push(e)})),this.propDatasetOneWeek={datasetInfo:a.data.dataset.datasetInfo,locations:{location:n,locationsName:a.data.dataset.locations.locationsName}},this.isLoading=!1}catch(e){this.isLoading=!1,console.warn(e),"Request failed with status code 401"===e.message&&(h.F.fire({icon:"error",title:"權限存取有誤，請重新登入"}),this.$store.commit("revokeAuthentication"),this.$router.push({path:"/signin"}))}}},mounted(){this.fetchDatasetOneWeekAndUserSave()}},c=d,u=a(1001),l=(0,u.Z)(c,s,n,!1,null,null,null),p=l.exports}}]);
//# sourceMappingURL=179.ff31d4ca.js.map