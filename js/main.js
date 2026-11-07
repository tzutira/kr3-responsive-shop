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
    description: "Открытый механизм, серебристый корпус и чёрный кожаный ремешок.",
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
    description: "Прямоугольный корпус, светлый циферблат и римские цифры.",
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
    description: "Скелетонизированный циферблат и серебристая архитектура механизма.",
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
  image.src = `images/archive-${product.id}-front-640.png`;
  image.srcset = `images/archive-${product.id}-front-320.png 320w, images/archive-${product.id}-front-640.png 640w`;
  image.closest("[data-gallery]").dataset.gallery = product.id;
  image.closest("[data-gallery]").setAttribute("aria-label", `Ракурсы ${product.name}`);
  document.querySelectorAll("[data-spec]").forEach(el => el.textContent = product[el.dataset.spec]);
  image.alt = `${product.name} — вид спереди, студийная визуализация`;
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

// Меню остаётся обычной навигацией без JS; на телефоне работает как disclosure.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('site-navigation');
const wideNavigation = matchMedia('(min-width: 1200px)');
function setMenu(open, returnFocus = false) {
  navigation.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.innerHTML = `${open ? 'Закрыть' : 'Меню'} <span aria-hidden="true">${open ? '−' : '＋'}</span>`;
  if (returnFocus) menuButton.focus();
}
function syncMenu() {
  const focusedLink = navigation.contains(document.activeElement);
  menuButton.hidden = wideNavigation.matches;
  setMenu(wideNavigation.matches, !wideNavigation.matches && focusedLink);
}
if (menuButton && navigation) {
  syncMenu();
  wideNavigation.addEventListener('change', syncMenu);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !wideNavigation.matches) setMenu(false, true);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a') && !wideNavigation.matches) setMenu(false, true);
  });
}

// Ручные карусели: без таймера, жестов с блокировкой вертикальной прокрутки и скрытых ссылок.
const angleNames = ['Спереди', 'Сбоку', 'Сзади'];
const angleFiles = ['front', 'side', 'back'];
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const id = gallery.dataset.gallery;
  const image = gallery.querySelector('img');
  let index = 0;
  function show(next) {
    index = (next + 3) % 3;
    const base = `images/archive-${id}-${angleFiles[index]}`;
    image.src = `${base}-640.png`;
    image.srcset = `${base}-320.png 320w, ${base}-640.png 640w`;
    image.alt = `${products[id].name} — вид ${angleNames[index].toLowerCase()}, студийная визуализация`;
    gallery.querySelector('.watch-gallery__status').textContent = `${angleNames[index]} · ${index + 1} / 3`;
  }
  gallery.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(index + Number(button.dataset.step))));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let start = null;
  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && !event.target.closest('button')) start = {x:event.clientX, y:event.clientY};
  });
  gallery.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    start = null;
  });
  gallery.addEventListener('pointercancel', () => { start = null; });
});

const filters = document.querySelector('.catalog-filters__form');
if (filters) {
  const grid = document.querySelector('.catalog-layout .products-grid');
  const cards = [...grid.querySelectorAll('[data-product-id]')];
  const search = document.getElementById('catalog-search');
  const sorting = document.getElementById('catalog-sort');
  const mechanisms = {manual:'Ручной завод', automatic:'Автоматический механизм', quartz:'Кварцевый механизм'};
  const cost = item => Number(item.price.replace(/\D/g, ''));
  function applyFilters() {
    const selected = [...filters.querySelectorAll('[name="mechanism"]:checked')].map(el => mechanisms[el.value]);
    const min = filters.elements['price-from'];
    const max = filters.elements['price-to'];
    max.setCustomValidity('');
    if (!filters.reportValidity()) return;
    if (min.value && max.value && Number(min.value) > Number(max.value)) {
      max.setCustomValidity('Верхняя граница должна быть не меньше нижней.');
      max.reportValidity(); return;
    }
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    cards.sort((a,b) => {
      const first = products[a.dataset.productId], second = products[b.dataset.productId];
      if (sorting.value === 'asc') return cost(first)-cost(second);
      if (sorting.value === 'desc') return cost(second)-cost(first);
      if (sorting.value === 'name') return first.name.localeCompare(second.name, 'ru');
      return Number(first.id)-Number(second.id);
    }).forEach(card => {
      const item = products[card.dataset.productId];
      card.hidden = !((!selected.length || selected.includes(item.category)) &&
        (!min.value || cost(item) >= Number(min.value)) && (!max.value || cost(item) <= Number(max.value)) &&
        `${item.name} ${item.color} ${item.description}`.toLocaleLowerCase('ru').includes(query));
      if (!card.hidden) count++;
      grid.append(card);
    });
    document.getElementById('catalog-count').textContent = `Найдено моделей: ${count}`;
    document.getElementById('catalog-empty').hidden = count !== 0;
  }
  filters.addEventListener('submit', event => {event.preventDefault(); applyFilters();});
  filters.addEventListener('input', () => filters.elements['price-to'].setCustomValidity(''));
  search.addEventListener('input', applyFilters);
  sorting.addEventListener('change', applyFilters);
  filters.addEventListener('reset', () => {
    search.value = ''; sorting.value = 'default';
    filters.elements['price-to'].setCustomValidity('');
    // Сброс нативных полей завершается после события reset.
    setTimeout(applyFilters, 0);
  });
  const filterDetails = document.querySelector('.filter-disclosure');
  filterDetails.open = matchMedia('(min-width: 1024px)').matches;
}

document.documentElement.classList.add("js-ready");
