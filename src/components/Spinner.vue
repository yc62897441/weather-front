<template>
  <div class="spinner">
    <div class="bouncing-loader">
      <div> </div>
      <div> </div>
      <div> </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  position: relative;
  padding-top: 100px;
}

.bouncing-loader {
  display: flex;
  justify-content: center;
}

.bouncing-loader::before {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  content: 'Loading...';
}

.bouncing-loader>div {
  width: 1rem;
  height: 1rem;
  margin: 3rem 0.2rem;
  background: #555555;
  border-radius: 50%;
  animation: bouncing-loader 0.6s infinite alternate;
}

.bouncing-loader>div:nth-child(2) {
  animation-delay: 0.2s;
}

.bouncing-loader>div:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bouncing-loader {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0.1;
    transform: translateY(-1rem);
  }
}
</style>