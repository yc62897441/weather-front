<template>
  <div class="main-container main-container-weatheroverview">
    <div class="title-wrapper">
      <h1>{{pageTitle}}</h1>
    </div>
    <table class="main-table">
      <thead class="table-header">
        <tr class="table-row">
          <th class="table-cell table-cell-save" v-if="isAuthenticated">加入蒐藏</th>
          <th class="table-cell table-cell-notify" v-if="isAuthenticated">開啟通知</th>
          <th class="table-cell table-cell-name">山岳</th>
          <th class="table-cell table-cell-each-day"
            v-for="time in propDatasetOneWeek.locations.location[0].weatherElement[3].time"
            v-bind:key="'date' + time.startTime">
            <div>{{ time.startTime.slice(0, 10) }}</div>
            <div>
              <div>最高溫</div>
              <div>最低溫</div>
              <div>降雨機率</div>
              <div>天氣現象</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr class="table-row" v-for="locat in propDatasetOneWeek.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <template v-if="isAuthenticated">
            <td class="table-cell table-cell-save saved"
              v-if="userSave.includes(locat.parameterSet.parameter.parameterValue)"
              v-on:click="removeFromUserSave(locat.parameterSet.parameter.parameterValue)"></td>
            <td class="table-cell table-cell-save" v-else
              v-on:click="addToUserSave(locat.parameterSet.parameter.parameterValue)"></td>
          </template>
          <template v-if="isAuthenticated">
            <td class="table-cell table-cell-notify notified" data-bs-toggle="modal"
              v-bind:data-bs-target="'#notificationModal'+locat.parameterSet.parameter.parameterValue"
              v-if="userNotificationMountainId === locat.parameterSet.parameter.parameterValue"></td>
            <td class="table-cell table-cell-notify" data-bs-toggle="modal"
              v-bind:data-bs-target="'#notificationModal'+locat.parameterSet.parameter.parameterValue" v-else>
            </td>
          </template>
          <td class="table-cell table-cell-name">
            <router-link class="link" v-bind:to="'/mountain/' + locat.parameterSet.parameter.parameterValue">
              {{ locat.locationName }}
            </router-link>
          </td>
          <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
            <div>
              <div>{{ locat.weatherElement[3].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[4].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[9].time[index - 1].elementValue.value || 'NA' }}%</div>
              <div>
                <img
                  v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + locat.weatherElement[12].time[index - 1].elementValue[1].value +'.svg'"
                  v-bind:title="locat.weatherElement[12].time[index - 1].elementValue[0].value"
                  v-bind:alt="locat.weatherElement[12].time[index - 1].elementValue[0].value">
              </div>
            </div>
          </td>

          <!-- Modal -->
          <div class="modal fade" v-bind:id="'notificationModal'+locat.parameterSet.parameter.parameterValue"
            tabindex="-1" aria-labelledby="notificationModal" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="notificationModal">天氣資訊即時通知</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <h2>{{ locat.locationName }}</h2>
                  <div class="notifyConditions-wrapper">
                    <h4>通知條件</h4>

                    <label for="rainrate">未來6小時降雨機率>=</label>
                    <input id="rainrate" type="number" min="0" max="100" v-model="notifyConditions.rainrate.value">

                    <label for="temperature">未來3小時溫度>=</label>
                    <input id="temperature" type="number" min="-10" max="50"
                      v-model="notifyConditions.temperature.value">

                    <label for="apparentTemperature">未來3小時體感溫度>=</label>
                    <input id="apparentTemperature" type="number" min="-10" max="50"
                      v-model="notifyConditions.apparentTemperature.value">

                    <button type="button" class="btn btn-danger"
                      v-if="userNotificationMountainId === locat.parameterSet.parameter.parameterValue"
                      v-on:click="offNotify(locat.parameterSet.parameter.parameterValue)">關閉通知</button>
                    <button type="button" class="btn btn-success" v-else
                      v-on:click="onNotify(locat.parameterSet.parameter.parameterValue)">開啟通知</button>
                  </div>
                  <div class="line-channel-wrapper">
                    <h5> 完成 Line Login 後請掃描加入好友 </h5>
                    <div class="line-channel-image-wrapper">
                      <img src="../assets/line_channel_qrcode.png">
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import indexAPI from '../api/index'

export default {
  props: {
    propDatasetOneWeek: {
      type: Object
    }
  },
  data() {
    return {
      pageTitle: '天氣總覽',
      userSave: [],
      userNotificationMountainId: '',
      notifyConditions: {
        temperature: {
          value: 30,
          index: 0
        },
        apparentTemperature: {
          value: 20,
          index: 8
        },
        rainrate: {
          value: 50,
          index: 3
        }
      }
    }
  },
  computed: {
    ...mapState(['currentUser', 'isAuthenticated'])
  },
  methods: {
    async fetchUserSave() {
      try {
        const response = await indexAPI.getUserSave()
        if (response.data.userSaves) {
          response.data.userSaves.forEach(item => {
            this.userSave.push(item.MountainId)
          })
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async addToUserSave(id) {
      try {
        this.userSave.push(id)
        const formData = { MountainId: id }
        const response = await indexAPI.addToUserSave({ formData })
      } catch (error) {
        console.warn(error)
      }
    },
    async removeFromUserSave(id) {
      try {
        this.userSave = this.userSave.map(item => {
          if (item !== id) {
            return item
          }
        })
        const formData = { MountainId: id }
        const response = await indexAPI.removeFromUserSave({ formData })
      } catch (error) {
        console.warn(error)
      }
    },
    async fetchUserNotification() {
      try {
        const response = await indexAPI.getUserNotification()
        if (response.data.userNotification) {
          this.userNotificationMountainId = response.data.userNotification.MountainId
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async onNotify(id) {
      try {
        // 如果沒有使用者的 LINE_USER_ID，開啟分頁讓使用者登入 LINE，後端即可儲存使用者的 LINE_USER_ID
        if (!this.currentUser.LINE_USER_ID) {
          let href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657482181&redirect_uri=https://side-project-weather-end.herokuapp.com/api/auth/line/callback&state=${this.currentUser.account}&scope=profile%20openid`
          window.open(href, '_blank')
        }

        this.userNotificationMountainId = id
        const formData = {
          MountainId: id,
          temperature: {
            value: this.notifyConditions.temperature.value,
            index: 0
          },
          apparentTemperature: {
            value: this.notifyConditions.apparentTemperature.value,
            index: 8
          },
          rainrate: {
            value: this.notifyConditions.rainrate.value,
            index: 3
          }
        }
        const response = await indexAPI.onNotify({ formData })
      } catch (error) {
        console.warn(error)
      }
    },
    async offNotify(id) {
      try {
        this.userNotificationMountainId = ''
        const formData = { MountainId: id }
        const response = await indexAPI.offNotify({ formData })
      } catch (error) {
        console.warn(error)
      }
    },
  },
  mounted() {
    if (this.$route.name === 'home') {
      this.pageTitle = '天氣總覽'
    } else if (this.$route.name === 'usersave') {
      this.pageTitle = '蒐藏列表'
    }

    this.fetchUserSave()
    this.fetchUserNotification()
  }
}

</script>

<style>
.table-header .table-cell-each-day>div:nth-child(1) {
  font-size: 1.2rem;
  padding: 3px 0px;
}

.table-cell-each-day div div {
  padding: 5px 0px;
}

.table-cell-each-day div div:not(:nth-child(4)) {
  border-right: 1px solid rgb(18, 52, 86, 0.4);
  flex: 1;
}

.table-cell-each-day div div:nth-child(1) {
  color: firebrick;
}

.table-cell-each-day div div:nth-child(2) {
  color: darkblue
}

.table-cell-each-day div div:nth-child(4) img {
  width: 30px;
  height: 30px;
}

.notifyConditions-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 200px;
}

.notifyConditions-wrapper input {
  margin-bottom: 10px;
}

.line-channel-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.line-channel-image-wrapper {
  min-width: 250px;
  min-height: 250px;
}

.line-channel-image-wrapper img {
  max-width: 250px;
  max-height: 250px;
  object-fit: cover;
}
</style>