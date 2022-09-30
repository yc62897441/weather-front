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
                  <div class="subtitle-wrapper">
                    <h6 class="modal-title" id="notificationModal">天氣資訊即時通知</h6>
                  </div>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="subtitle-wrapper">
                    <h6>{{ locat.locationName }}</h6>
                  </div>
                  <div class="notify-control-wrapper">
                    <form class="notifyConditions-wrapper">
                      <div class="subtitle-wrapper">
                        <h6>通知條件</h6>
                      </div>

                      <label class="form-label" for="rainrate">未來6小時降雨機率(大於等於)</label>
                      <input class="form-control" id="rainrate" type="number" min="0" max="100"
                        v-model="notifyConditions.rainrate.value" v-on:keyup.prevent.stop="valueInRange($event)">

                      <label class="form-label" for="temperature">未來3小時溫度(大於等於)</label>
                      <input class="form-control" id="temperature" type="number" min="-20" max="50"
                        v-model="notifyConditions.temperature.value" v-on:keyup.prevent.stop="valueInRange($event)">

                      <label class="form-label" for="apparentTemperature">未來3小時體感溫度(大於等於)</label>
                      <input class="form-control" id="apparentTemperature" type="number" min="-20" max="50"
                        v-model="notifyConditions.apparentTemperature.value"
                        v-on:keyup.prevent.stop="valueInRange($event)">
                    </form>
                    <button type="button" class="btn btn-danger"
                      v-if="userNotificationMountainId === locat.parameterSet.parameter.parameterValue"
                      v-on:click="offNotify(locat.parameterSet.parameter.parameterValue)">關閉通知</button>
                    <button type="button" class="btn btn-success" v-else
                      v-on:click="onNotify(locat.parameterSet.parameter.parameterValue)">開啟通知</button>
                  </div>
                  <div class="line-channel-wrapper">
                    <div class="subtitle-wrapper">
                      <h5>1.點擊「開啟通知」，完成 Line Login</h5>
                      <h5>2.掃描「QR-code」加入 Line「天氣通知」好友</h5>
                    </div>
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
    valueInRange(event) {
      switch (event.target.id) {
        case 'rainrate':
          if (this.notifyConditions.rainrate.value > 100) {
            this.notifyConditions.rainrate.value = 100
          }
          if (this.notifyConditions.rainrate.value < 0) {
            this.notifyConditions.rainrate.value = 0
          }
          break
        case 'temperature':
          if (this.notifyConditions.temperature.value > 50) {
            this.notifyConditions.temperature.value = 50
          }
          if (this.notifyConditions.temperature.value < -20) {
            this.notifyConditions.temperature.value = -20
          }
          break
        case 'apparentTemperature':
          if (this.notifyConditions.apparentTemperature.value > 50) {
            this.notifyConditions.apparentTemperature.value = 50
          }
          if (this.notifyConditions.apparentTemperature.value < -20) {
            this.notifyConditions.apparentTemperature.value = -20
          }
          break
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

/* modal 樣式*/
.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.subtitle-wrapper {
  padding-bottom: 3px;
  font-size: 1rem;
  font-weight: 700;
}

.notify-control-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  margin: 0px auto;
}

.notifyConditions-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notifyConditions-wrapper label {
  margin-bottom: 3px;
}

.notifyConditions-wrapper input {
  margin-bottom: 8px;
}

.line-channel-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.line-channel-wrapper .subtitle-wrapper {
  width: 250px;
  margin: 0px auto;
  line-height: 20px;
}

.notify-control-wrapper .btn {
  width: 75px;
  padding: 2px 3px;
}

.line-channel-image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px auto;
}

.line-channel-image-wrapper img {
  width: 180px;
  height: 180px;
  object-fit: cover;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {

  /* modal 樣式*/
  .subtitle-wrapper {
    padding-bottom: 5px;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .notify-control-wrapper {
    width: 400px;
  }

  .notifyConditions-wrapper label {
    margin-bottom: 5px;
  }

  .notifyConditions-wrapper input {
    margin-bottom: 12px;
  }

  .notify-control-wrapper .btn {
    width: 150px;
    padding: 4px 6px;
  }

  .line-channel-wrapper .subtitle-wrapper {
    width: 400px;
    line-height: 24px;
  }

  .line-channel-image-wrapper img {
    width: 250px;
    height: 250px;
    object-fit: cover;
  }
}
</style>