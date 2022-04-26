const cardTemplate = document.querySelector("#card");
const cardsContainer = document.querySelector(".cards__container");
const authorFilter = document.querySelector(".filter");
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const authors = new Set();
const date = new Set();
let articlesList = [];

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articlesList = articles;
    articles.forEach((article) => {
      authors.add(article.author);
      date.add(article.publishedAt);

      renderArticle(article);

      const option = document.createElement("option");
      option.textContent = article.author;
      authorFilter.appendChild(option);
    });
    articles;
  })
  .catch((error) => console.log(error));

const getTemplate = () =>
  cardTemplate.content.querySelector(".element").cloneNode(true);

const setCardData = (card, { title, description, author, publishedAt }) => {
  let date = new Date(publishedAt);
  date = `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
  card.querySelector(".element__title").innerText = title;
  card.querySelector(".element__description").innerText = description;
  card.querySelector(".element__badge_author").innerText =
    author == undefined ? "no name" : author;
  card.querySelector(".element__badge_date").innerText = date;
};

const renderArticle = (article) => {
  const card = getTemplate();
  setCardData(card, article);
  cardsContainer.appendChild(card);
};

const handleFilter = (e) => {
  const filteringData = articlesList.filter((c) => c.author === e.target.value);
  cardsContainer.innerHTML = "";
  filteringData.forEach((article) => renderArticle(article));
  console.log(filteringData);
};

authorFilter.addEventListener("change", handleFilter);
