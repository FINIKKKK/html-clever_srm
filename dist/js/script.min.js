const form = document.querySelector("#form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector("#form__name").value;
  const email = document.querySelector("#form__email").value;

  const errorElements = document.querySelectorAll(".span__error");
  for (let i = 0; i < errorElements.length; i++) {
    errorElements[i].remove();
  }
  const inputElements = document.querySelectorAll(".input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].classList.remove("error");
  }

  if (name.length < 1) {
    const nameInput = document.querySelector("#form__name");
    nameInput.classList.add("error");
    nameInput.insertAdjacentHTML(
      "afterend",
      '<span class="span__error">Заполните поле</span>'
    );
  }
  if (email.length < 1) {
    const emailInput = document.querySelector("#form__email");
    emailInput.classList.add("error");
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
      emailInput.classList.add("error");
      emailInput.insertAdjacentHTML(
        "afterend",
        '<span class="span__error">Заполните правильно</span>'
      );
    }
  }
});
