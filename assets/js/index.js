// Получаем все необходимые элементы из DOM по id, которые мы ранее указали в html
const openFormBtn = document.getElementById("open-form-btn");
const cancelFormBtn = document.getElementById("cancel-form-btn");
const createRouteBtn = document.getElementById("create-route-btn");
const addCardForm = document.getElementById("card-form");
const addCardFormOverlay = document.getElementById("add-form-overlay");
const cardsWrapper = document.getElementById("cards");
const orderedCardsWrapper = document.getElementById("cards-ordered");

// Массив, который хранит в себе все карточки
const cards = [];

/**
 * Суть следующих функций: closeForm, openForm, addCard, renderCards и createRoute.
 * Это функции, которые срабатывают при событиях, которые указаны ниже.
 * Вот как изначально бы выгладел код, который бы вызывал n-ую функцию при нажатии на
 * n-ную кнопку:
 * 
 * button.addEventListener('click', (event) => {
 *    ...код функции 
 * })
 * 
 * button - html элемент, который мы получили из DOM (document.querySelector, document.getElementById, etc)
 * addEventListener - метод, присущий каждому элементу DOM, объявляет событие на данном элементе
 * click - тип события (еще есть всякие mouseover, mousemove, doubleclick, submit и т.д)
 * (event) => {} - та самая функция (стрелочная. Иначе можно было написать function(event) {})
 * event - аргумент, который принимает каждая функция для события. Дословный перевод - событие.
 *         содержит в себе много полезного
 * 
 * Все, что я сделал, это разделил задачу события и функцию, связанную с ним:
 * 
 * const someFunc = event => {}
 * button.addEventListener('click', someFunc)
 */

// Функция, отвечающая за закрытие выскакивающей формы. e - тот самый event
const closeForm = (e) => {
  // Метод, останавливающий обработку событий на страницу дальше настоящего события. Здесь эта строчка бесполезна
  e.stopPropagation();
  /* Написал эту строчку, только потому что она обычно, насколько я могу судить, идет бок-о-бок со строчкой выше
     Самая частая причина использования - отмена автообновления формы при ее отправке (событие submit) */
  e.preventDefault();
  /* addCardFormOverlay - это элемент, в который обернута форма. Отображение формы регулируется css свойством display 
     у overlay'а */
  addCardFormOverlay.style.display = "none";
};

// Иначе у overlay'a по стилям display должен быть grid 
const openForm = () => {
  addCardFormOverlay.style.display = "grid";
};

// Функция для "отправки формы"
const addCard = (e) => {
  // Та самая отмена автообновления
  e.preventDefault();

  /* Подготовка объекта, который будет храниться в массиве cards. Заметь, нет валидации
     У каждого event'a есть доступ к элементу, на котором оно сработало - event.target
     У каждого DOM элемента есть "дети" - как бы массив. У тех, в свою очередь, свои
     дети - древовидная структура
     У конечных элементов берутся value, потому что мы работаем с элементами textarea 
     и input - они заданы в форме в html 
     info - описание (именно оно отображается на странице) 
     from - откуда 
     to - куда */
  const cardData = {
    info: e.target.children[1].children[1].value,
    from: e.target.children[3].children[0].children[0].value,
    to: e.target.children[3].children[1].children[0].value
  };

  // Опустошаем форму во избежание казуса
  e.target.children[1].children[1].value = "";
  e.target.children[3].children[0].children[0].value = "";
  e.target.children[3].children[1].children[0].value = "";

  // Добавляем объект в массив, закрываем форму с помощью уже известной функции
  cards.push(cardData);
  closeForm(e);
  
  // Заново рендерим карточки
  renderCards(false, cards);
};

/* Слегка замудреная на первый взгляд функция, которую, возможно, стоит упростить
   Идея состоит в том, чтобы иметь одну функцию для отображения и карточек, и маршрутов
   (далее - упорядоченных карточек - orderedCards).
   Возможно, это не лучшая идея и все-таки будет лучше, если данная функция будет разбита 
   на две.
   isOrdered - аргумент, который помогает решить, что отображать (содержание cardsWrapper 
   или orderedCardsWrapper). Если он true, то маршрут, если false - карточки 
   cards - массив, с которым будем работать */
const renderCards = (isOrdered, cards) => {
  /* Не доведенное до ума условие отображение кнопки "построить маршрут" и содержания wrapper'ов
     Необходимо доработать */
  if (isOrdered) {
    createRouteBtn.style.display = "none";
    orderedCardsWrapper.innerHTML = "";
  } else {
    createRouteBtn.style.display = "block";
    cardsWrapper.innerHTML = "";
  }

  /* Для каждого элемента массива card создаем новый html элемент
     (card) => {...} - функция, срабатывающая на каждой итерации
     card - отдельная карточка на каждой итерации*/
  cards.forEach((card) => {
    // Создаем новый div и присваиваем ему класс card
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    /* innerHTML - тот html, что находится внутри этого div'a. По сути - это строка
       Используем интерполяцию строк, чтобы вместить и необходимую разметку и info 
       отдельной card */
    cardElement.innerHTML += `
      <div class="text">
        <div class="info">${card.info}</div>
      </div>
      <div class="buttons">
        <button class="edit-btn">
          <img src="./assets/images/editing.png" alt="edit button" />
        </button>
        <button class="delete-btn">
          <img src="./assets/images/delete.png" alt="edit button" />
        </button>
      </div>
    `;

    // В зависимости от того, что мы отображаем, добавляем созданный элемент к соответстующему wrapper'у
    if (isOrdered) {
      orderedCardsWrapper.appendChild(cardElement);
    } else {
      cardsWrapper.appendChild(cardElement);
    }
  });
};

// Функция, отвечающая за создание маршрута
const createRoute = () => {
  // Копирование массива cards с помощью деструктуризации
  const newCards = [...cards];

  // Сортировка скопированных данных
  newCards.sort((firstCard, secondCard) => {
    // Сортируем по полям to и from
    if (firstCard.to.toLowerCase() == secondCard.from.toLowerCase()) {
      return 1;
    }

      return -1;
    })
    // Не помню, зачем тут reverse
    .reverse();
  
  // Собственно, рендерим маршрут
  renderCards(true, newCards);
};

// Присваивание функций к их событиям (как и зачем - выше)
openFormBtn.addEventListener("click", openForm);
cancelFormBtn.addEventListener("click", closeForm);
createRouteBtn.addEventListener("click", createRoute);
addCardForm.addEventListener("submit", addCard);

/* При первой загрузке страницы рендерим карточки (на данном этапе эта функция бесполезна, т.к мы 
   ниоткуда не получаем изначальные данные) */
window.onload = () => renderCards(false, cards);