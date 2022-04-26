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
const showAll = "Show all";
let articlesList = [];

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articlesList = articles;
    articles.forEach((article) => {
      authors.add(article.author);
      date.add(article.publishedAt);

      renderArticle(article);
      renderAuthorOption(article.author);
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

const renderAuthorOption = (author) => {
  const option = document.createElement("option");
  option.textContent = author;
  authorFilter.appendChild(option);
};

const handleFilter = (e) => {
  const selectedAuthor = e.target.value;
  cardsContainer.innerHTML = "";
  let filteringData = articlesList;
  if (selectedAuthor !== showAll)
    filteringData = articlesList.filter((c) => c.author === selectedAuthor);
  filteringData.forEach((article) => renderArticle(article));
};

authorFilter.addEventListener("change", handleFilter);
renderAuthorOption(showAll);
