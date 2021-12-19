const openFormBtn = document.getElementById("open-form-btn");
const cancelFormBtn = document.getElementById("cancel-form-btn");
const createRouteBtn = document.getElementById("create-route-btn");
const addCardForm = document.getElementById("card-form");
const addCardFormOverlay = document.getElementById("add-form-overlay");
const cardsWrapper = document.getElementById("cards");
const orderedCardsWrapper = document.getElementById("cards-ordered");
const cards = [];

const closeForm = (e) => {
  e.stopPropagation();
  e.preventDefault();
  addCardFormOverlay.style.display = "none";
};

const openForm = () => {
  addCardFormOverlay.style.display = "grid";
};

const addCard = (e) => {
  e.preventDefault();

  createRouteBtn.style.display = "none";

  const cardData = {
    info: e.target.children[1].children[1].value,
    from: e.target.children[3].children[0].children[0].value,
    to: e.target.children[3].children[1].children[0].value
  };

  e.target.children[1].children[1].value = "";
  e.target.children[3].children[0].children[0].value = "";
  e.target.children[3].children[1].children[0].value = "";

  cards.push(cardData);

  closeForm(e);
  renderCards(false, cards);
};

const renderCards = (isOrdered) => {
  if (isOrdered) {
    createRouteBtn.style.display = "none";
    orderedCardsWrapper.innerHTML = "";
  } else {
    createRouteBtn.style.display = "block";
    cardsWrapper.innerHTML = "";
  }

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

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

    if (isOrdered) {
      orderedCardsWrapper.appendChild(cardElement);
    } else {
      cardsWrapper.appendChild(cardElement);
    }
  });
};

const createRoute = () => {
  // ordering routes
  const newCards = [...cards];

  newCards
    .sort((firstCard, secondCard) => {
      if (firstCard.to.toLowerCase() === secondCard.from.toLowerCase()) {
        return true;
      }

      return false;
    })
    .reverse();

  renderCards(true, newCards);
};

openFormBtn.addEventListener("click", openForm);
cancelFormBtn.addEventListener("click", closeForm);
createRouteBtn.addEventListener("click", createRoute);
addCardForm.addEventListener("submit", addCard);

window.onload = () => renderCards(false, cards);
