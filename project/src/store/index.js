import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find(
        (item) => item.productOfferId === productId
      );

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(
        (item) => item.productId !== productId
      );
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        // noinspection JSUnresolvedReference
        return {
          productOfferId: item.productOffer.id,
          amount: item.quantity,
        };
      });
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        // noinspection JSUnresolvedReference
        const productFromOffer = state.cartProductsData.find(
          (p) => p.productOffer.id === item.productOfferId
        );
        // noinspection JSUnresolvedReference
        return {
          ...item,
          basketItemId: productFromOffer.id,
          offerTitle: productFromOffer.productOffer.title,
          productFromOffer: {
            ...productFromOffer.productOffer.product,
            image: productFromOffer.productOffer.product.preview.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.productFromOffer.price * item.amount + acc,
        0
      );
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL + '/api/orders/' + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      return axios
        .get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, { productId, colorId, amount }) {
      return axios
        .post(
          API_BASE_URL + '/api/baskets/products',
          {
            productOfferId: productId,
            colorId: colorId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });
      if (amount < 1) {
        return;
      }

      return axios
        .put(
          API_BASE_URL + '/api/baskets/products',
          {
            basketItemId: productId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .then(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, productId) {
      return axios
        .delete(API_BASE_URL + '/api/baskets/products', {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            basketItemId: productId,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
  },
});
