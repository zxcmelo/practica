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