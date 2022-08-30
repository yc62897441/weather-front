<template>
  <div class="main-container main-container-weatheroverview">
    <h1>天氣總覽</h1>
    <table class="main__table">
      <thead>
        <tr class="table__header table__row">
          <th class="table__cell table__cell--name">名字</th>
        </tr>
      </thead>
      <tbody class="table__body">
        <tr class="table__row" v-for="locat in propDataset.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <td class="table__cell table__cell--name">{{  locat.locationName  }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    propDataset: {
      type: Object
    }
  }
}

</script>