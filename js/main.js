// набор данных связывает каталог, страницу товара и форму заявки
const products = {
  "1": {
    id: "1",
    name: "NOIR Archive 01",
    brand: "NOIR",
    description: "Чёрный циферблат, стальной корпус и сдержанная винтажная эстетика.",
    price: "68 500 ₽",
    color: "Чёрный",
    category: "Ручной завод",
    image: "watch-480.svg",
    badge: ""
  },

  "2": {
    id: "2",
    name: "NOIR Archive 02",
    brand: "NOIR",
    description: "Серебристый циферблат и лаконичные часовые метки.",
    price: "84 900 ₽",
    color: "Серебристый",
    category: "Автоматический механизм",
    image: "watch-480.svg",
    badge: ""
  },

  "3": {
    id: "3",
    name: "NOIR Archive 03",
    brand: "NOIR",
    description: "Светлый циферблат и строгие пропорции классических часов.",
    price: "52 000 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    image: "watch-480.svg",
    badge: ""
  },

  "4": {
    id: "4",
    name: "NOIR Archive 04",
    brand: "NOIR",
    description: "Тёмный циферблат и выразительный силуэт стального корпуса.",
    price: "96 000 ₽",
    color: "Чёрный",
    category: "Автоматический механизм",
    image: "watch-480.svg",
    badge: ""
  },

  "5": {
    id: "5",
    name: "NOIR Archive 05",
    brand: "NOIR",
    description: "Серебристые детали и эстетика механических часов прошлых десятилетий.",
    price: "73 500 ₽",
    color: "Серебристый",
    category: "Ручной завод",
    image: "watch-480.svg",
    badge: ""
  },

  "6": {
    id: "6",
    name: "NOIR Archive 06",
    brand: "NOIR",
    description: "Минималистичный циферблат и спокойный повседневный характер.",
    price: "45 000 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    image: "watch-480.svg",
    badge: ""
  }
};

const params = new URLSearchParams(window.location.search);
const product = products[params.get('product')] || products['1'];
const productTitle = document.getElementById('product-title');
if (productTitle) {
  productTitle.textContent = product.name;
  document.title = `${product.name} — NOIR`;
  document.getElementById('product-breadcrumb').textContent = product.name;
  document.getElementById('product-description').textContent = product.description;
  const price = document.getElementById('product-price');
  price.textContent = product.price;
  price.classList.toggle('product-detail__price--discount', product.badge === 'Скидка');
  document.getElementById('product-color').textContent = product.color;
  document.getElementById('product-category').textContent = product.category;
  const image = document.getElementById('product-image');
  image.src = `images/${product.image}`;
  image.alt = `Временная иллюстрация модели ${product.name}`;
  document.getElementById('product-order-button').dataset.product = product.name;
}

const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const selectedProductInput = document.getElementById('selected-product');
const orderTopicSelect = document.getElementById('order-topic');
const successMessage = document.getElementById('success-message');

function clearErrors() {
  Array.from(orderForm.elements).forEach((field) => {
    if (!field.willValidate) return;
    field.removeAttribute('aria-invalid');
    field.classList.remove(getFieldErrorClass(field));
  });
}
function openOrder(name = '') {
  orderForm.reset();
  clearErrors();
  successMessage.hidden = true;
  selectedProductInput.value = name;
  orderTopicSelect.value = name ? 'product' : 'consultation';
  orderDialog.showModal();
}
document.querySelectorAll('.product-card__button[data-product]').forEach((button) => {
  button.addEventListener('click', () => openOrder(button.dataset.product));
});
document.getElementById('open-order-dialog')?.addEventListener('click', () => openOrder());
document.getElementById('close-order-dialog')?.addEventListener('click', () => orderDialog.close());

// На отдельной странице заявки выбранный товар берётся из адреса.
if (orderForm && !orderDialog && products[params.get('product')]) {
  selectedProductInput.value = product.name;
  orderTopicSelect.value = 'product';
}
selectedProductInput?.addEventListener('change', () => {
  const chosenProduct = Object.values(products).find((item) => item.name === selectedProductInput.value);
  orderTopicSelect.value = chosenProduct ? 'product' : 'consultation';
});
function getFieldErrorClass(field) {
  if (field.type === 'checkbox') return 'order-form__checkbox--error';
  if (field.tagName === 'SELECT') return 'order-form__select--error';
  if (field.tagName === 'TEXTAREA') return 'order-form__textarea--error';
  return 'order-form__input--error';
}
orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  clearErrors();
  if (!orderForm.checkValidity()) {
    Array.from(orderForm.elements).forEach((field) => {
      if (field.willValidate && !field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        field.classList.add(getFieldErrorClass(field));
      }
    });
    orderForm.reportValidity();
    return;
  }
  successMessage.hidden = false;
  orderForm.reset();
  orderDialog?.close();
  if (!orderDialog) successMessage.scrollIntoView({ block: 'nearest' });
});
