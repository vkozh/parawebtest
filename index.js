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
const SHOWALL = "Select author";
const NONAME = "no name";
let articlesList = [];

fetch("https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc")
  .then((res) => res.json())
  .then(({ articles }) => {
    articles.forEach((article) => {
      article.author = article.author == undefined ? NONAME : article.author;
      renderArticle(article);
      renderAuthorOption(article.author);
    });
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

const renderAuthorOption = (author) => {
  const option = document.createElement("option");
  option.textContent = author;
  authorFilter.appendChild(option);
};

const handleClickAuthor = (e) => {
  const selectedAuthor = e.target.innerText;
  filterAuthor(selectedAuthor);
  authorFilter.value = selectedAuthor;
};

const handleFilterAuthor = (e) => {
  filterAuthor(e.target.value);
};

const filterAuthor = (selectedAuthor) => {
  cardsContainer.innerHTML = "";
  let filteringData = articlesList;
  if (selectedAuthor !== SHOWALL)
    filteringData = articlesList.filter((c) => c.author === selectedAuthor);
  filteringData.forEach((article) => renderArticle(article));
};

authorFilter.addEventListener("change", handleFilterAuthor);
renderAuthorOption(SHOWALL);

const flky = new Flickity(".carousel", {
  prevNextButtons: false,
  cellAlign: "left",
  //   percentPosition: false,
});
