<template>
  <div>
    <ui-modal
      modalID="addOrderModal"
      title="Добавить заказ"
      :no-body-padding="true"
    >
      <template v-slot:modalBody>
        <OrdersForm />
      </template>
    </ui-modal>
  </div>
</template>
<script>
import UiModal from '@/components/popups/UiModal'
import OrdersForm from '@/components/orders/OrdersForm'

export default {
  components: {
    UiModal,
    OrdersForm
  }
}
</script>
