import "../node_modules/flickity/dist/flickity.min.css";
import "./index.css";
let Flickity = require("flickity");

const cardTemplate = document.querySelector("#card");
const cardsContainer = document.querySelector(".cards__container");
const authorFilter = document.querySelector(".name-filter");
const dateFilterInner = document.querySelector(".date-filter__inner");
const dateFromFilterFakeInput = dateFilterInner.querySelector(
  "#date-from-filter-fake"
);
const dateToFilterFakeInput = dateFilterInner.querySelector(
  "#date-to-filter-fake"
);
const dateFromFilterInput = dateFilterInner.querySelector(
  ".date-filter__input-from"
);
const dateToFilterInput = dateFilterInner.querySelector(
  ".date-filter__input-to"
);
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
const authors = new Set(null);
const SHOWALL = "Select author";
const NONAME = "no name";
let articlesList = [];
let selectedAuthor = SHOWALL;
let selectedDate = {
  from: new Date().toISOString(),
  to: new Date().toISOString(),
};

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articles.forEach((article) => {
      article.author = article.author == undefined ? NONAME : article.author;
      authors.add(article.author);
      if (article.publishedAt < selectedDate.from) {
        selectedDate.from = article.publishedAt;
        dateFromFilterInput.min = article.publishedAt;
        dateToFilterInput.min = article.publishedAt;
      }
      if (article.publishedAt > selectedDate.to) {
        selectedDate.to = article.publishedAt;
        dateFromFilterInput.max = article.publishedAt;
        dateToFilterInput.max = article.publishedAt;
      }
      renderArticle(article);
    });
    renderAuthorOptions(authors);
    articlesList = articles;
  })
  .catch((error) => console.log(error));

const getTemplate = () =>
  cardTemplate.content.querySelector(".element").cloneNode(true);

const setCardData = (card, { title, description, author, publishedAt }) => {
  const authorElement = card.querySelector(".element__badge_author");
  let date = new Date(publishedAt);
  date = `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
  card.querySelector(".element__title").innerText = title;
  card.querySelector(".element__description").innerText = description;
  card.querySelector(".element__badge_date").innerText = date;
  authorElement.innerText = author;
  authorElement.addEventListener("click", handleClickAuthor);
};

const renderArticle = (article) => {
  const card = getTemplate();
  setCardData(card, article);
  cardsContainer.appendChild(card);
};

const renderAuthorOptions = (authors) => {
  Array.from(authors)
    .sort()
    .forEach((author) => {
      authorFilter.appendChild(createOption(author));
    });
  authorFilter.prepend(createOption(SHOWALL));
  authorFilter.value = SHOWALL;
};

const createOption = (author) => {
  const option = document.createElement("option");
  option.textContent = author;
  return option;
};

const filter = () => {
  let filteringArticles = filterAuthor();
  filteringArticles = filterDate(filteringArticles);
  return filteringArticles;
};

const filterAuthor = () => {
  let filteringArticles = articlesList;
  cardsContainer.innerHTML = "";
  if (selectedAuthor !== SHOWALL)
    filteringArticles = articlesList.filter(
      (article) => article.author === selectedAuthor
    );
  return filteringArticles;
};

const filterDate = (articles) => {
  const filteringArticles = articles.filter(
    (article) =>
      new Date(article.publishedAt) >= new Date(selectedDate.from) &&
      new Date(article.publishedAt) <= new Date(selectedDate.to)
  );
  return filteringArticles;
};

const handleClickAuthor = (e) => {
  selectedAuthor = e.target.innerText;
  const filteringArticles = filter();
  filteringArticles.forEach((article) => renderArticle(article));
  authorFilter.value = selectedAuthor;
};

const handleFilterAuthor = (e) => {
  selectedAuthor = e.target.value;
  const filteringArticles = filter();
  filteringArticles.forEach((article) => renderArticle(article));
};

const handleFilterDate = (input) => {
  input.showPicker();
};

const handleFilterDateChange = (input, fakeInput, field) => {
  fakeInput.value = input.value;
  selectedDate[field] = new Date(input.value).toISOString();
  const filteringArticles = filter();
  filteringArticles.forEach((article) => renderArticle(article));
};

authorFilter.addEventListener("change", handleFilterAuthor);
dateFromFilterFakeInput.addEventListener("click", () =>
  handleFilterDate(dateFromFilterInput)
);
dateToFilterFakeInput.addEventListener("click", () =>
  handleFilterDate(dateToFilterInput)
);
dateFromFilterInput.addEventListener("change", () =>
  handleFilterDateChange(dateFromFilterInput, dateFromFilterFakeInput, "from")
);
dateToFilterInput.addEventListener("change", () =>
  handleFilterDateChange(dateToFilterInput, dateToFilterFakeInput, "to")
);

const flky = new Flickity(".carousel", {
  prevNextButtons: false,
  cellAlign: "left",
  autoPlay: true,
});
