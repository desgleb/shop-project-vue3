<template>
  <legend class="form__legend">{{ selectedCategoryPropTitle }}</legend>
  <ul class="check-list">
    <li
      class="check-list__item"
      v-for="value in selectedCategoryAvailableValues"
      :key="value.value"
    >
      <label class="check-list__label">
        <input
          class="check-list__check sr-only"
          type="radio"
          name="volume"
          :value="value.value"
          v-model="selectedCategoryProps"
          @change="setProps"
        />
        <span class="check-list__desc">
          {{ value.value }}
          <!--suppress JSUnresolvedReference -->
          <span>({{ value.productsCount }})</span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  props: {
    currentCategoryId: Number,
    categoryProps: Object,
  },
  emits: ['update:categoryProps'],
  data() {
    return {
      checkedCategoryId: this.currentCategoryId,
      selectedCategory: null,
      selectedCategoryPropCode: '',
      selectedCategoryPropTitle: '',
      selectedCategoryAvailableValues: [],
      selectedCategoryProps: [],
      propsObj: {},
    };
  },
  watch: {
    currentCategoryId() {
      this.productsInCategory();
    },
  },
  methods: {
    productsInCategory() {
      if (this.currentCategoryId > 0) {
        // noinspection JSUnresolvedReference
        return axios
          .get(
            API_BASE_URL + '/api/productCategories/' + this.currentCategoryId
          )
          .then((response) => (this.selectedCategory = response.data))
          .then(
            () =>
              (this.selectedCategoryPropCode =
                this.selectedCategory?.productProps[0]?.code)
          )
          .then(
            () =>
              (this.selectedCategoryPropTitle =
                this.selectedCategory?.productProps[0]?.title)
          )
          .then(
            () =>
              (this.selectedCategoryAvailableValues =
                this.selectedCategory?.productProps[0]?.availableValues)
          )
          .then(() => (this.checkedCategoryId = this.currentCategoryId));
      }
    },
    setProps() {
      this.propsObj.code = this.selectedCategoryPropCode;
      this.propsObj.value = this.selectedCategoryProps;
      this.$emit('update:categoryProps', this.propsObj);
    },
  },
  created() {
    this.productsInCategory();
  },
};
</script>
