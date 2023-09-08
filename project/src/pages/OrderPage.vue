<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <!--suppress HtmlUnknownTarget -->
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <!--suppress HtmlUnknownTarget -->
          <a class="breadcrumbs__link" href="cart.html"> Корзина </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> 3 товара </span>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="order"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="formError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
            />

            <label class="form__label">
              <input
                v-model="formData.address"
                class="form__input"
                type="text"
                name="address"
                placeholder="Введите ваш адрес"
              />
              <span class="form__value">Адрес доставки</span>
              <span class="form__error" v-if="formError.address">{{
                formError.address
              }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="formData.phone"
                class="form__input"
                type="tel"
                name="phone"
                placeholder="Введите ваш телефон"
              />
              <span class="form__value">Телефон</span>
              <span class="form__error" v-if="formError.phone">{{
                formError.phone
              }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="formData.email"
                class="form__input"
                type="email"
                name="email"
                placeholder="Введи ваш Email"
              />
              <span class="form__value">Email</span>
              <span class="form__error" v-if="formError.email">{{
                formError.email
              }}</span>
            </label>

            <BaseFormTextarea
              title="Комментарий к заказу"
              v-model="formData.comment"
              :error="formError.comment"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="delivery in deliveriesData"
                :key="delivery.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :checked="delivery.id === deliveryTypeId"
                    :value="delivery.id"
                    @click="chooseDeliveryType"
                  />
                  <span class="options__value">
                    {{ delivery.title }}
                    <b>{{
                      delivery.price === '0' ? 'бесплатно' : delivery.price
                    }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="payment in paymentsData"
                :key="payment.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="payment.id"
                    :checked="payment.id === paymentTypeId"
                    @click="choosePaymentType"
                  />
                  <span class="options__value"> {{ payment.title }} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li
              class="cart__order"
              v-for="product in products"
              :key="product.productId"
            >
              <h3>{{ product.offerTitle }}</h3>
              <b>{{ product.productFromOffer.price * product.amount }} ₽</b>
              <span>Артикул: {{ product.productFromOffer.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>
              Доставка:
              <b>{{ superPrice ? superPrice : 'бесплатно' }}</b>
            </p>
            <p>
              Итого: <b>{{ products.length }}</b> товара на сумму
              <b>{{ totalPricePretty }} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            <!--suppress HtmlUnknownTag -->
            <div v-if="formSending" class="lds-roller color--green">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span v-else>Оформить заказ</span>
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';

export default {
  components: { BaseFormText, BaseFormTextarea },
  data() {
    return {
      formData: {},
      formError: {},
      paymentsData: [],
      deliveriesData: [],
      deliveryTypeId: 1,
      deliveryPrice: '0',
      paymentTypeId: 2,
      formErrorMessage: '',
      formSending: false,
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
    }),
    totalPricePretty() {
      return numberFormat(this.totalPrice);
    },
    superPrice() {
      return this.deliveriesData.length !== 0
        ? this.deliveriesData.find((item) => item.id === this.deliveryTypeId)
            .price
        : '0';
    },
  },
  methods: {
    getDeliveries() {
      this.deliveriesData = [];
      axios
        .get(API_BASE_URL + '/api/deliveries')
        .then((response) => {
          this.deliveriesData = response.data;
        })
        .catch((err) => console.log(err));
    },
    getPayments() {
      this.paymentsData = [];
      axios
        .get(API_BASE_URL + '/api/payments', {
          params: {
            deliveryTypeId: this.deliveryTypeId,
          },
        })
        .then((response) => {
          this.paymentsData = response.data;
        })
        .then(() => (this.paymentTypeId = this.paymentsData[0].id))
        .catch((err) => console.log(err));
    },
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.formSending = true;
      axios
        .post(
          API_BASE_URL + '/api/orders',
          {
            ...this.formData,
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({
            name: 'orderInfo',
            params: { id: response.data.id },
          });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        })
        .then(() => (this.formSending = false));
    },
    chooseDeliveryType(event) {
      this.deliveryTypeId = +event.target.value;
    },
    choosePaymentType(event) {
      this.paymentTypeId = +event.target.value;
    },
  },
  watch: {
    deliveryTypeId() {
      this.getPayments();
      this.formData.deliveryTypeId = this.deliveryTypeId;
    },
    paymentTypeId() {
      this.formData.paymentTypeId = this.paymentTypeId;
    },
  },
  created() {
    this.getDeliveries();
    this.getPayments();
  },
};
</script>
