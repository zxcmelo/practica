// Слайдер
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentSlide = 0;
  let slideInterval;

  // Создаем точки навигации
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dot');

  // Показать слайд
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  // Следующий слайд
  function nextSlide() {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
  }

  // Предыдущий слайд
  function prevSlide() {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  // Перейти к конкретному слайду
  function goToSlide(index) {
    showSlide(index);
    resetInterval();
  }

  // Автопрокрутка
  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  // Назначение обработчиков кнопок
  document.querySelector('.next-btn').addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });
  document.querySelector('.prev-btn').addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Запуск слайдера
  startAutoSlide();
};

// Поиск и фильтрация услуг
const initServices = () => {
  const serviceItems = document.querySelectorAll('.service-item');
  const searchInput = document.querySelector('.search-container input');
  const sortButtons = document.querySelectorAll('.sort-btn');
  const paginationButtons = document.querySelectorAll('.page-btn');
  const itemsPerPage = 3;
  let currentPage = 1;
  let filteredItems = Array.from(serviceItems);

  // Функция фильтрации по поиску
  function filterServices() {
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredItems = Array.from(serviceItems).filter(item => {
      const name = item.dataset.name.toLowerCase();
      const description = item.querySelector('p').textContent.toLowerCase();
      return name.includes(searchTerm) || description.includes(searchTerm);
    });

    currentPage = 1;
    updateDisplay();
    updatePagination();
  }

  // Функция сортировки
  function sortServices(sortType) {
    switch(sortType) {
      case 'price-asc':
        filteredItems.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        break;
      case 'price-desc':
        filteredItems.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        break;
      case 'name-asc':
        filteredItems.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        break;
      case 'name-desc':
        filteredItems.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
        break;
      default:
        // По умолчанию - порядок в HTML
        filteredItems.sort((a, b) => 
          Array.from(serviceItems).indexOf(a) - Array.from(serviceItems).indexOf(b)
        );
    }

    currentPage = 1;
    updateDisplay();
    updatePagination();
  }

  // Обновление отображаемых элементов
  function updateDisplay() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Скрыть все элементы
    serviceItems.forEach(item => {
      item.style.display = 'none';
    });

    // Показать только отфильтрованные и отсортированные
    paginatedItems.forEach(item => {
      item.style.display = 'block';
    });
  }

  // Обновление пагинации
  function updatePagination() {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    // Скрыть все кнопки пагинации
    paginationButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    // Показать нужные кнопки
    for (let i = 0; i < totalPages && i < paginationButtons.length; i++) {
      paginationButtons[i].style.display = 'block';
      paginationButtons[i].classList.toggle('active', i + 1 === currentPage);
    }
  }

  // Обработчики событий
  searchInput.addEventListener('input', filterServices);

  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sortButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortServices(btn.dataset.sort);
    });
  });

  paginationButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentPage = index + 1;
      updateDisplay();
      updatePagination();
    });
  });

  // Инициализация
  updateDisplay();
  updatePagination();
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация слайдера, если он есть на странице
  if (document.querySelector('.slider')) {
    slider();
  }

  // Инициализация услуг, если они есть на странице
  if (document.querySelector('.service-list')) {
    initServices();
  }
  
  // Анимация при прокрутке
  const fadeInElements = document.querySelectorAll('.fade-in');
  
  function checkFadeIn() {
    fadeInElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.9) {
        element.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkFadeIn);
  window.addEventListener('load', checkFadeIn);
});
// Функционал галереи изображений
const initGallery = () => {
  const mainImage = document.querySelector('.main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');

  if (!mainImage || !thumbnails.length) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Удаляем активный класс у всех миниатюр
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Добавляем активный класс текущей миниатюре
      thumb.classList.add('active');
      
      // Обновляем главное изображение
      mainImage.src = thumb.querySelector('img').src;
    });
  });
};

// Функционал добавления отзывов
const initReviews = () => {
  const reviewForm = document.createElement('div');
  reviewForm.className = 'review-form';
  reviewForm.innerHTML = `
    <h3>Добавить отзыв</h3>
    <form id="add-review-form">
      <div class="form-group">
        <label for="review-name">Ваше имя:</label>
        <input type="text" id="review-name" required>
      </div>
      <div class="form-group">
        <label for="review-rating">Оценка:</label>
        <select id="review-rating" required>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
      </div>
      <div class="form-group">
        <label for="review-text">Текст отзыва:</label>
        <textarea id="review-text" required></textarea>
      </div>
      <button type="submit" class="btn">Отправить</button>
    </form>
  `;

  const reviewsSection = document.querySelector('.reviews');
  const btnOutline = document.querySelector('.btn-outline');

  if (!reviewsSection || !btnOutline) return;

  btnOutline.addEventListener('click', () => {
    if (!document.querySelector('.review-form')) {
      reviewsSection.insertBefore(reviewForm, btnOutline);
    }
  });

  // Обработка отправки формы
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'add-review-form') {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value;
      const rating = document.getElementById('review-rating').value;
      const text = document.getElementById('review-text').value;
      
      if (!name || !text) return;

      const stars = '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);
      
      // Создаем новый отзыв
      const newReview = document.createElement('div');
      newReview.className = 'review';
      newReview.innerHTML = `
        <div class="review-header">
          <div class="review-author">${name}</div>
          <div class="review-date">${new Date().toLocaleDateString()}</div>
          <div class="review-rating">${stars}</div>
        </div>
        <div class="review-text">
          <p>${text}</p>
        </div>
      `;

      // Добавляем в начало списка
      const reviewList = document.querySelector('.review-list');
      reviewList.prepend(newReview);

      // Сохраняем в localStorage
      saveReviewToLocalStorage({ name, rating, text, date: new Date().toLocaleDateString() });

      // Очищаем форму
      e.target.reset();
      reviewForm.remove();
    }
  });

  // Загрузка отзывов из localStorage при загрузке страницы
  loadReviewsFromLocalStorage();
};

// Сохранение отзыва в localStorage
function saveReviewToLocalStorage(review) {
  const reviews = JSON.parse(localStorage.getItem('service-reviews') || '[]');
  reviews.push(review);
  localStorage.setItem('service-reviews', JSON.stringify(reviews));
}

// Загрузка отзывов из localStorage
function loadReviewsFromLocalStorage() {
  const reviews = JSON.parse(localStorage.getItem('service-reviews') || '[]');
  const reviewList = document.querySelector('.review-list');

  if (!reviewList) return;

  reviews.forEach(review => {
    const stars = '★★★★★☆☆☆☆☆'.slice(5 - review.rating, 10 - review.rating);
    
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review';
    reviewElement.innerHTML = `
      <div class="review-header">
        <div class="review-author">${review.name}</div>
        <div class="review-date">${review.date}</div>
        <div class="review-rating">${stars}</div>
      </div>
      <div class="review-text">
        <p>${review.text}</p>
      </div>
    `;
    
    reviewList.appendChild(reviewElement);
  });
}

// Обновляем обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.slider')) {
    slider();
  }

  if (document.querySelector('.service-list')) {
    initServices();
  }

  // Инициализация галереи
  initGallery();

  // Инициализация отзывов
  initReviews();

  const fadeInElements = document.querySelectorAll('.fade-in');
  
  function checkFadeIn() {
    fadeInElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.9) {
        element.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkFadeIn);
  window.addEventListener('load', checkFadeIn);
});
// Валидация формы обратной связи
const initContactForm = () => {
  const contactForm = document.querySelector('.contacts-page form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    let isValid = true;

    // Валидация имени
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Пожалуйста, введите ваше имя');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Валидация email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Пожалуйста, введите email');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, 'Пожалуйста, введите корректный email');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Валидация сообщения
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Пожалуйста, введите сообщение');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      // Здесь можно добавить отправку формы
      alert('Форма успешно отправлена!');
      contactForm.reset();
    }
  });

  // Функция проверки email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Функция показа ошибки
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = '#ff6b6b';
  }

  // Функция очистки ошибки
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.style.borderColor = '#ddd';
  }
};

// Обеспечиваем открытие ссылок на соцсети в новом окне
const initSocialLinks = () => {
  const socialLinks = document.querySelectorAll('.social-icons a');
  socialLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
};