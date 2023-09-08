import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { computed, reactive, ref } from 'vue';

export default function () {
  const productData = ref(null);
  const category = computed(() => {
    return productData.value.category;
  });
  const colors = computed(() => {
    return productData.value.colors.map((color) => {
      return {
        ...color,
        backgroundColor: `background-color: ${color.color.code}`,
      };
    });
  });

  const fetchStatus = reactive({
    isLoading: false,
    isFailed: false,
  });

  const fetchProduct = (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isFailed = false;
    axios
      .get(API_BASE_URL + '/api/products/' + productId)
      .then((response) => {
        const product = response.data;
        productData.value = Object.assign(product, {
          pricePretty: numberFormat(product.price),
        });
      })
      .catch(() => (fetchStatus.isFailed = true))
      .then(() => (fetchStatus.isLoading = false));
  };

  return {
    product: productData,
    category,
    colors,
    status: fetchStatus,

    fetchProduct,
  };
}
