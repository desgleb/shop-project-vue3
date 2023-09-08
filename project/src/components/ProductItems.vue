<!-- eslint-disable prettier/prettier -->
<template>
  <li v-bind="$attrs" v-for="product in productsNormalized" :key="product.id">
    <!--suppress JSUnresolvedReference -->
    <router-link
      class="catalog__pic"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title" @click.prevent="openQuickView(product.id)">
      <a href="#"> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ product.pricePretty }} </span>
    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="color in product.colors"
        :key="color.color.title"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.color.code"
            v-model="currentColor"
          />
          <span class="colors__value" :style="color.backgroundColor"> </span>
        </label>
      </li>
    </ul>
  </li>

  <BaseModal v-model:open="isQuickViewOpen">
    <ProductQuickView :product-id="currentProductId" />
  </BaseModal>
</template>

<script>
import goToPage from '@/helpers/goToPage';
import numberFormat from '@/helpers/numberFormat';
import BaseModal from '@/components/BaseModal.vue';
import { defineAsyncComponent, h } from 'vue';

export default {
  components: {
    BaseModal,
    ProductQuickView: defineAsyncComponent({
      loader: () => import('@/components/ProductQuickView.vue'),
      delay: 0,
      loadingComponent: () => h('div', 'Загрузка...'),
    }),
  },
  inheritAttrs: false,
  data() {
    return {
      currentColor: this.products[0]?.colors[0]?.code,
      productsElements: [],
      currentProductId: null,
    };
  },
  methods: {
    goToPage,
    openQuickView(productId) {
      this.currentProductId = productId;
    },
  },
  computed: {
    isQuickViewOpen: {
      get() {
        return !!this.currentProductId;
      },
      set(isOpen) {
        if (!isOpen) {
          this.currentProductId = null;
        }
      },
    },
    productsNormalized() {
      return this.products.map((product) => {
        return {
          ...product,
          pricePretty: numberFormat(product.price),
          colors: product.colors.map((color) => {
            return {
              ...color,
              backgroundColor: `background-color: ${color.color.code}`,
            };
          }),
        };
      });
    },
  },
  beforeUpdate() {
    this.productsElements = [];
  },
  props: ['products'],
};
</script>
