<template>
  <div class="home">
    <template>
      <div class="not-found-wrapper">
        <h1>
          404 Page Not Found
        </h1>
      </div>
    </template>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding-bottom: 20vh;
  background-color: var(--main);
  font-size: 2rem;
  font-weight: 400;
  color: var(--main-font-color);
}

/* Small devices (landscape phones, 374px and down) */
@media (min-width: 375px) {
  .not-found-wrapper {
    font-size: 2.4rem;
    font-weight: 700;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .not-found-wrapper {
    font-size: 3rem;
    font-weight: 900;
  }
}
</style>