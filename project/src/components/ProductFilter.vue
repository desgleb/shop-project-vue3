<!-- eslint-disable prettier/prettier -->
<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="color.id"
                checked=""
                v-model="currentColorId"
              />
              <span class="colors__value" :style="color.backgroundColor">
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset
        class="form__block"
        v-show="
          currentCategoryId !== 0 &&
          currentCategoryId !== 2 &&
          currentCategoryId !== 9
        "
      >
        <FilterCheckList
          :current-category-id="currentCategoryId"
          v-model:category-props="currentProps"
        ></FilterCheckList>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
        v-if="currentCategoryId !== 0 || currentColorId != null"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import FilterCheckList from '@/components/FilterCheckList.vue';

export default {
  components: { FilterCheckList },
  props: ['products', 'priceFrom', 'priceTo', 'categoryId', 'colorId', 'props'],
  emits: [
    'update:priceFrom',
    'update:priceTo',
    'update:categoryId',
    'update:colorId',
    'update:props',
  ],
  data() {
    return {
      currentPriceFrom: 1,
      currentPriceTo: 1000000,
      currentCategoryId: 0,
      currentColorId: null,
      currentProps: {},
      categoriesData: null,
      colorsData: null,
    };
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData
        ? this.colorsData.items.map((color) => {
            return {
              ...color,
              backgroundColor: `background-color: ${color.code}`,
            };
          })
        : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorId(value) {
      this.currentColorId = value;
    },
    props(value) {
      this.currentProps = value;
    },
  },
  methods: {
    submit() {
      if (!this.currentPriceFrom) {
        this.currentPriceFrom = 1;
      }
      if (!this.currentPriceTo) {
        this.currentPriceTo = 1000000;
      }
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorId', this.currentColorId);
      this.$emit('update:props', this.currentProps);
    },
    reset() {
      this.$emit('update:priceFrom', 1);
      this.$emit('update:priceTo', 1000000);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorId', null);
      this.$emit('update:props', []);
      this.currentCategoryId = 0;
      this.currentColorId = null;
    },
    loadCategories() {
      axios
        .get(API_BASE_URL + '/api/productCategories')
        .then((response) => (this.categoriesData = response.data));
    },
    loadColors() {
      axios
        .get(API_BASE_URL + '/api/colors')
        .then((response) => (this.colorsData = response.data));
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
  },
};
</script>
