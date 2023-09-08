<template>
  <div class="form__counter">
    <button
      type="button"
      aria-label="Убрать один товар"
      @click.prevent="decreaseAmount"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="currentProductAmount" />

    <button
      type="button"
      aria-label="Добавить один товар"
      @click.prevent="increaseAmount"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentProductAmount: 1,
    };
  },
  props: ['productAmount'],
  watch: {
    productAmount(value) {
      this.currentProductAmount = value;
    },
  },
  methods: {
    increaseAmount() {
      this.currentProductAmount++;
      this.$emit('update:productAmount', this.currentProductAmount);
    },
    decreaseAmount() {
      if (this.currentProductAmount === 1) return;
      this.currentProductAmount--;
      this.$emit('update:productAmount', this.currentProductAmount);
    },
  },
};
</script>
