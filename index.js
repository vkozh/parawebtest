const cardTemplate = document.querySelector("#card");
const cardsContainer = document.querySelector(".cards__container");
const authorFilter = document.querySelector(".name-filter");
const dateFilterContainer = document.querySelector(".date-filter__container");
const dateFilterFakeInput = dateFilterContainer.querySelector(
  ".date-filter__fake-input"
);
const dateFilterInput = dateFilterContainer.querySelector(
  ".date-filter__input"
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

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articles.forEach((article) => {
      article.author = article.author == undefined ? NONAME : article.author;
      authors.add(article.author);
      renderArticle(article);
    });
    renderAuthorOption(authors);
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

const renderAuthorOption = (authors) => {
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

const filterAuthor = (selectedAuthor) => {
  cardsContainer.innerHTML = "";
  let filteringData = articlesList;
  if (selectedAuthor !== SHOWALL)
    filteringData = articlesList.filter((c) => c.author === selectedAuthor);
  filteringData.forEach((article) => renderArticle(article));
};

const handleClickAuthor = (e) => {
  const selectedAuthor = e.target.innerText;
  filterAuthor(selectedAuthor);
  authorFilter.value = selectedAuthor;
};

const handleFilterAuthor = (e) => {
  filterAuthor(e.target.value);
};

const handleFilterDate = () => {
  dateFilterInput.showPicker();
};

const handleFilterDateChange = () => {
  dateFilterFakeInput.value = dateFilterInput.value;
};

authorFilter.addEventListener("change", handleFilterAuthor);
dateFilterContainer.addEventListener("click", handleFilterDate);
dateFilterInput.addEventListener("change", handleFilterDateChange);

const flky = new Flickity(".carousel", {
  prevNextButtons: false,
  cellAlign: "left",
  autoPlay: true,
});
