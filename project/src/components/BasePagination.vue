<!-- eslint-disable prettier/prettier -->
<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        href="javascript:void(0);"
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === 1 }"
        @click.prevent="prevPage(page)"
        aria-label="Предыдущая страница"
        :disabled="this.page === 1"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a
        href="javascript:void(0);"
        class="pagination__link"
        :class="{ 'pagination__link--current': pageNumber === page }"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a
        href="javascript:void(0);"
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === pages }"
        @click.prevent="nextPage(page)"
        aria-label="Следующая страница"
        :disabled="this.page === this.pages"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['modelValue', 'count', 'perPage'],
  computed: {
    page() {
      return this.modelValue;
    },
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      this.$emit('update:modelValue', page);
    },
    nextPage(page) {
      if (this.page === this.pages) return;
      this.$emit('update:modelValue', page + 1);
    },
    prevPage(page) {
      if (this.page === 1) return;
      this.$emit('update:modelValue', page - 1);
    },
  },
};
</script>
