const cardTemplate = document.querySelector("#card");
const cardsContainer = document.querySelector(".cards__container");

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articles.forEach((article) => {
      const card = getTemplate();
      setCardData(card, article);
      cardsContainer.appendChild(card);
    });
  })
  .catch((error) => console.log(error));

const getTemplate = () =>
  cardTemplate.content.querySelector(".element").cloneNode(true);

const setCardData = (card, { title, description, author, publishedAt }) => {
  card.querySelector(".element__title").innerText = title;
  card.querySelector(".element__description").innerText = description;
  card.querySelector(".element__badge_author").innerText = author;
  card.querySelector(".element__badge_date").innerText = publishedAt;
};
