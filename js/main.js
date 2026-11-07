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

let dialogOpener = null;
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.classList.remove(getFieldErrorClass(field));
  const error = document.getElementById(`${field.id}-error`);
  if (error) { error.textContent = ''; error.hidden = true; }
}
function clearErrors() {
  Array.from(orderForm.elements).forEach(clearFieldError);
}
function openOrder(name = '') {
  dialogOpener = document.activeElement;
  orderForm.reset();
  clearErrors();
  successMessage.hidden = true;
  selectedProductInput.value = name;
  orderTopicSelect.value = name ? 'product' : 'consultation';
  orderDialog.showModal();
  // Заголовок сообщает назначение окна; фон блокирует нативный dialog.
  document.getElementById('order-dialog-title').focus();
}
orderDialog?.addEventListener('close', () => {
  if (orderDialog.open) return;
  if (successMessage.hidden) dialogOpener?.focus();
  else successMessage.focus();
});
// Цикл Tab остаётся в окне, включая переход назад с заголовка.
orderDialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = Array.from(orderDialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]'))
    .filter((element) => !element.disabled && element.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === document.getElementById('order-dialog-title'))) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
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
function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    return field.type === 'checkbox' ? 'Подтвердите согласие, чтобы продолжить.' : 'Заполните обязательное поле.';
  }
  if (field.validity.typeMismatch) return 'Введите корректный e-mail, например name@example.ru.';
  if (field.validity.patternMismatch) return 'Введите телефон в формате +7 (900) 000-00-00.';
  if (field.validity.tooShort) return `Введите не менее ${field.minLength} символов.`;
  return field.validationMessage;
}
function showFieldError(field) {
  field.setAttribute('aria-invalid', 'true');
  field.classList.add(getFieldErrorClass(field));
  const error = document.getElementById(`${field.id}-error`);
  if (error) { error.textContent = getErrorMessage(field); error.hidden = false; }
}
function updateFieldError(event) {
  const field = event.target;
  if (!field.hasAttribute('aria-invalid')) return;
  if (field.validity.valid) clearFieldError(field);
  else showFieldError(field);
}
orderForm?.addEventListener('input', updateFieldError);
orderForm?.addEventListener('change', updateFieldError);
orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  clearErrors();
  const invalidFields = Array.from(orderForm.elements).filter((field) => field.willValidate && !field.validity.valid);
  if (invalidFields.length) {
    invalidFields.forEach(showFieldError);
    invalidFields[0].focus();
    return;
  }
  successMessage.hidden = false;
  orderForm.reset();
  if (orderDialog) orderDialog.close();
  else successMessage.focus();
});
