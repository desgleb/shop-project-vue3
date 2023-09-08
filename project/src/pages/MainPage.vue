<!-- eslint-disable prettier/prettier -->
<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info" v-if="endsWithOne">
        {{ countProducts }} товар
      </span>
      <span class="content__info" v-else> {{ countProducts }} товаров </span>
    </div>

    <div class="content__catalog">
      <!--suppress JSUnresolvedReference -->
      <ProductFilter
        :products="products"
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:color-id="filterColorId"
        v-model:props="filterProps"
      />

      <section class="catalog">
        <div v-if="productsLoading" class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div v-if="productsLoadingFailed" style="font-size: 54px">
          Произошла ошибка при загрузке товаров.
        </div>
        <button
          v-if="productsLoadingFailed"
          @click.prevent="loadProducts"
          class="button--reload"
        >
          Попробовать еще раз
        </button>

        <ProductList
          :products="productsFilteredByColor"
          v-if="productsLoading === false && productsLoadingFailed === false"
        />

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
          v-if="
            productsLoading === false &&
            productsLoadingFailed === false &&
            filterColorId === null
          "
        />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 1,
      filterPriceTo: 1000000,
      filterCategoryId: null,
      filterColorId: null,
      filterProps: {},
      page: 1,
      productsPerPage: 6,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => {
            return {
              ...product,
              image: product.preview.file.url,
              availableColors: product.availableColors,
            };
          })
        : [];
    },
    productsFilteredByColor() {
      return this.filterColorId
        ? this.products.filter((product) =>
            product.availableColors.includes(this.filterColorId)
          )
        : this.products;
    },
    countProducts() {
      // noinspection JSUnresolvedReference
      return this.productsData && !this.filterColorId
        ? this.productsData.pagination.total
        : this.productsFilteredByColor.length;
    },
    endsWithOne() {
      return this.countProducts.toString().endsWith('1');
    },
  },
  methods: {
    loadProducts() {
      const propsQueryName = `props[${this.filterProps.code}][]`;
      const URLParams = new URLSearchParams();
      URLParams.append('minPrice', this.filterPriceFrom);
      URLParams.append('maxPrice', this.filterPriceTo);

      if (this.filterColorId) {
        console.log(this.filterColorId, '<= colorId');
      } else {
        URLParams.append('page', this.page);
        URLParams.append('limit', this.productsPerPage);
      }

      URLParams.append('categoryId', this.filterCategoryId);

      if (this.filterProps.code) {
        URLParams.append(propsQueryName, this.filterProps.value);
      }

      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + '/api/products', {
            params: URLParams,
          })
          .then((response) => {
            // noinspection JSUnresolvedReference
            response.data.items?.forEach((item) => {
              const colorIdsArray = [];
              item.colors.forEach((color) => {
                colorIdsArray.push(color.color.id);
              });
              item.availableColors = colorIdsArray;
            });
            return response.data;
          })
          .then((data) => (this.productsData = data))
          .catch(() => (this.productsLoadingFailed = true))
          .then(() => (this.productsLoading = false));
      }, 0);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
    filterProps() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
