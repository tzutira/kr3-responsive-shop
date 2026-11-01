// набор данных связывает каталог, страницу товара и форму заявки
const products = {
  "1": {
    "id": "1",
    "name": "Широкие джинсы Coated Noir",
    "brand": "Pistola",
    "description": "Высокая посадка, широкие штанины и чёрный деним с покрытием. Выразительная основа образа.",
    "price": "5 900 ₽",
    "color": "Чёрный",
    "category": "Джинсы",
    "image": "black-coated-wide-leg-jeans.jpg",
    "badge": "Новинка"
  },
  "2": {
    "id": "2",
    "name": "Бордовая куртка",
    "brand": "Escala",
    "description": "Прямой силуэт, отложной воротник и застёжка на молнии. Бордовый акцент для многослойных образов.",
    "price": "12 900 ₽",
    "color": "Бордовый",
    "category": "Куртки",
    "image": "burgundy-leather-jacket.jpg",
    "badge": "Скидка"
  },
  "3": {
    "id": "3",
    "name": "Кремовое поло на молнии",
    "brand": "H&M",
    "description": "Трикотаж в рубчик, короткий рукав и воротник с молнией. Светлая фактура для сочетания с широкими брюками.",
    "price": "3 200 ₽",
    "color": "Кремовый",
    "category": "Поло",
    "image": "cream-zip-polo.jpg",
    "badge": "База"
  },
  "4": {
    "id": "4",
    "name": "Серые широкие брюки",
    "brand": "Cph Muse",
    "description": "Широкий крой и стрелки. Структурированный силуэт, который сочетается с рубашкой или свободным трикотажем.",
    "price": "5 400 ₽",
    "color": "Светло-серый",
    "category": "Брюки",
    "image": "grey-wide-leg-trousers.jpg",
    "badge": ""
  },
  "5": {
    "id": "5",
    "name": "Свитер Destroy Knit",
    "brand": "Maison Mihara Yasuhiro",
    "description": "Свободный серый трикотаж с намеренными потёртостями и рваными краями. Фактурный акцент коллекции.",
    "price": "6 900 ₽",
    "color": "Серый",
    "category": "Трикотаж",
    "image": "grey-distressed-sweater.jpg",
    "badge": ""
  },
  "6": {
    "id": "6",
    "name": "Белая свободная рубашка",
    "brand": "COS",
    "description": "Свободная посадка, классический воротник и удлинённый округлый низ. Для самостоятельного образа или второго слоя.",
    "price": "3 900 ₽",
    "color": "Белый",
    "category": "Рубашки",
    "image": "white-relaxed-shirt.jpg",
    "badge": "База"
  }
};
const params = new URLSearchParams(window.location.search);
const product = products[params.get('product')] || products['1'];
const productTitle = document.getElementById('product-title');
if (productTitle) {
  productTitle.textContent = product.name;
  document.title = `${product.name} — Artel Studio`;
  document.getElementById('product-breadcrumb').textContent = product.name;
  document.getElementById('product-description').textContent = product.description;
  const price = document.getElementById('product-price');
  price.textContent = product.price;
  price.classList.toggle('product-detail__price--discount', product.badge === 'Скидка');
  document.getElementById('product-color').textContent = product.color;
  document.getElementById('product-category').textContent = product.category;
  const image = document.getElementById('product-image');
  image.src = `images/${product.image}`;
  image.alt = `${product.name}, вид спереди`;
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
