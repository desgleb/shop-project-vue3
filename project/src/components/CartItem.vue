<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.productFromOffer.image"
        width="120"
        height="120"
        :alt="item.productFromOffer.title"
      />
    </div>
    <h3 class="product__title">{{ item.offerTitle }}</h3>
    <span class="product__code"> {{ item.productFromOffer.id }} </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="amount--"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count" />

      <button
        type="button"
        aria-label="Добавить один товар"
        @click.prevent="amount++"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">{{ totalPricePretty }} ₽</b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.basketItemId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    totalPricePretty() {
      return numberFormat(this.item.amount * this.item.productFromOffer.price);
    },
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          productId: this.item.basketItemId,
          amount: value,
        });
      },
    },
  },
  methods: {
    ...mapActions({ deleteProduct: 'deleteCartProduct' }),
  },
};
</script>
