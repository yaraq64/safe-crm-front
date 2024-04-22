<script setup>
import $bus from '@/plugins/events'
import { toast } from 'vue3-toastify'

$bus.on('showNotification', (data) => {
  const message = (() => {
    let message = ''
    if (data.type === 'error') {
      message = `
        <div class="title">
          Произошла ошибка
        </div>
        <div class="description">
          ${data.message}  
        </div>
      `

      console.error('Произошла ошибка: ', data)
    } else {
      message = `<div class="title">${data.message}</div>`
    }

    return `
      <div class="content">
        ${message}  
      </div>
    `
  })()

  toast(message, {
    autoClose: data.type === 'error' ? false : 3000,
    type: data.type,
    transition: 'zoom',
    hideProgressBar: true,
    dangerouslyHTMLString: true,
    position: toast.POSITION.TOP_RIGHT
  })
})
</script>

<style lang="scss">
.Toastify__toast {
  &-body {
    white-space: normal !important;
    .content {
      padding-left: 5px;
    }
    .title {
      font-weight: bold;
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .description {
      font-size: 14px;
    }
  }
  &-container {
    --toastify-toast-width: 440px;
  }
}
</style>
