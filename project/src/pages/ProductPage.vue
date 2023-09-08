<!-- eslint-disable prettier/prettier -->
<template>
  <main class="content container" v-if="productStatus.isLoading">
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </main>
  <main class="content container" v-else-if="productStatus.isFailed">
    <div style="font-size: 54px">Произошла ошибка при загрузке товаров.</div>
    <!--suppress JSUnresolvedReference -->
    <button @click.prevent="loadProduct" class="button--reload">
      Попробовать еще раз
    </button>
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ product.title }} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="product.preview?.file?.url"
            :alt="product.title"
          />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">{{ product.title }}</h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <b class="item__price"> {{ product.pricePretty }} </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li
                  class="colors__item"
                  v-for="color in colors"
                  :key="color.code"
                >
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      :value="color.color.id"
                      @click="chooseColor"
                    />
                    <span class="colors__value" :style="color.backgroundColor">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">
                {{ product.mainProp.title }}:
              </legend>

              <ul class="sizes sizes--primery">
                <li
                  class="sizes__item"
                  v-for="offer in product.offers"
                  :key="offer.id"
                >
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      type="radio"
                      name="sizes-item"
                      :value="offer.id"
                      @click="chooseOffer"
                    />
                    <span class="sizes__value">
                      {{ offer.propValues[0].value }}
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <FormCounter v-model:product-amount="productAmount" />
              <button
                class="button button--primery"
                type="submit"
                :disabled="productIsChosen"
              >
                В корзину
              </button>
              <BaseModal v-model:open="isShowAddedMessage">
                Товар добавлен в корзину
              </BaseModal>
            </div>

            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар в корзину...</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current"> Описание </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Характеристики </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Гарантия </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Оплата и доставка </a>
          </li>
        </ul>

        <div class="item__content">
          <ul>
            <li v-for="spec in product.specifications" :key="spec.id">
              <p>{{ spec.title }}: {{ spec.value }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import FormCounter from '@/components/FormCounter.vue';
import BaseModal from '@/components/BaseModal.vue';
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';

export default defineComponent({
  components: {
    BaseModal,
    FormCounter,
  },
  setup() {
    const $store = useStore();
    const $route = useRoute();
    const {
      product,
      category,
      colors,
      status: productStatus,
      fetchProduct,
    } = useProduct();

    const isShowAddedMessage = ref(false);
    const productAmount = ref(1);
    const productAdded = ref(false);
    const productAddSending = ref(false);
    const productOfferChosen = ref(null);
    const productColorChosen = ref(null);
    const addToCartDisabled = ref(true);
    const productReadyCheck = () => {
      addToCartDisabled.value =
        productAddSending.value ||
        !productColorChosen.value ||
        !productOfferChosen.value;
    };
    const chooseOffer = (target) => {
      productOfferChosen.value = target.target.value;
      productReadyCheck();
    };
    const chooseColor = (target) => {
      productColorChosen.value = target.target.value;
      productReadyCheck();
    };
    const addToCart = () => {
      productAdded.value = false;
      productAddSending.value = true;
      $store
        .dispatch('addProductToCart', {
          productId: productOfferChosen.value,
          colorId: productColorChosen.value,
          amount: productAmount.value.toString(),
        })
        .then(() => {
          isShowAddedMessage.value = true;
          productAdded.value = true;
          productAddSending.value = false;
        });

      productAmount.value = 1;
    };

    fetchProduct($route.params.id);

    return {
      addToCart,
      productAmount,
      productData: product,
      productStatus,
      isShowAddedMessage,
      productAdded,
      productAddSending,
      productIsChosen: addToCartDisabled,
      product,
      productOfferChosen,
      productColorChosen,
      category,
      colors,
      chooseOffer,
      chooseColor,
    };
  },
});
</script>
