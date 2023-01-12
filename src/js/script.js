@@include('../../node_modules/swiper/swiper-bundle.min.js');

// --- Валидация формы
document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector("#form__name").value;
  const email = document.querySelector("#form__email").value;
  const phone = document.querySelector("#form__phone").value;
  const company = document.querySelector("#form__company").value;

  const errorElements = document.querySelectorAll(".span__error");
  for (let i = 0; i < errorElements.length; i++) {
    errorElements[i].remove();
  }
  const inputElements = document.querySelectorAll(".input input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].parentNode.classList.remove("error");
  }

  if (name.length < 1) {
    const nameInput = document.querySelector("#form__name");
    nameInput.parentNode.classList.add("error");
    nameInput.insertAdjacentHTML(
      "afterend",
      '<span class="span__error">Заполните поле</span>'
    );
  }
  if (company.length < 1) {
    const companyInput = document.querySelector("#form__company");
    companyInput.parentNode.classList.add("error");
    companyInput.insertAdjacentHTML(
      "afterend",
      '<span class="span__error">Заполните поле</span>'
    );
  }
  if (phone.length < 1) {
    const phoneInput = document.querySelector("#form__phone");
    phoneInput.parentNode.classList.add("error");
    phoneInput.insertAdjacentHTML(
      "afterend",
      '<span class="span__error">Заполните поле</span>'
    );
  } else {
    const regEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const phoneEmail = regEx.test(phone);
    if (!phoneEmail) {
      const phoneInput = document.querySelector("#form__phone");
      phoneInput.parentNode.classList.add("error");
      phoneInput.insertAdjacentHTML(
        "afterend",
        '<span class="span__error">Заполните правильно</span>'
      );
    }
  }
  if (email.length < 1) {
    const emailInput = document.querySelector("#form__email");
    emailInput.parentNode.classList.add("error");
    emailInput.insertAdjacentHTML(
      "afterend",
      '<span class="span__error">Заполните поле</span>'
    );
  } else {
    const regEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regEx.test(email);
    if (!validEmail) {
      const emailInput = document.querySelector("#form__email");
      emailInput.parentNode.classList.add("error");
      emailInput.insertAdjacentHTML(
        "afterend",
        '<span class="span__error">Заполните правильно</span>'
      );
    }
  }
});

document.querySelector(".hamburger").addEventListener("click", function () {
  document.querySelector(".header").classList.toggle("mobile");
  document.querySelector("html").classList.toggle("fixed");
});

document
  .querySelector(".header .btn__wrapper")
  .addEventListener("click", function () {
    if (document.querySelector(".header").classList.contains("mobile")) {
      document.querySelector(".header").classList.remove("mobile");
      document.querySelector("html").classList.remove("fixed");
    }
  });
document
  .querySelector(".header .list .item")
  .addEventListener("click", function () {
    if (document.querySelector(".header").classList.contains("mobile")) {
      document.querySelector(".header").classList.remove("mobile");
      document.querySelector("html").classList.remove("fixed");
    }
  });

// --- Slider
const swiper_places = new Swiper(".slider", {
  slidesPerView: 2,
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
  pagination: {
    el: ".pagination",
    clickable: true,
  },
  autoplay: {
      delay: 8000,
      disableOnInteraction: true,
  },
  breakpoints: {
    // when window width is >= 320px
    0: {
      slidesPerView: 1,
      spaceBetween: 80,
      centeredSlides: true,
    },
    // when window width is >= 600px
    600: {
        slidesPerView: 2,
        spaceBetween: 30,
        centeredSlides: false,
    },
    // when window width is >= 800px
    800: {
        slidesPerView: 2,
        spaceBetween: 30,
        centeredSlides: true,
    },
  }
});
