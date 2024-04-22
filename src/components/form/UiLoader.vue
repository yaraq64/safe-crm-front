<template>
  <div class="ui-loader">
    <div class="ui-loader-body">
      <div class="ui-loader-dot"></div>
      <div class="ui-loader-dot"></div>
      <div class="ui-loader-dot"></div>
      <div class="ui-loader-dot"></div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-loader {
  display: flex;
  justify-content: center;
  &-body {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    position: relative;
  }
  &-dot {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $color-gray-dark;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
  }
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
