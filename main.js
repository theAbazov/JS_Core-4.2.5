const searchField = document.querySelector(".search");
const searchForm = document.querySelector(".search-form");
const hintsList = document.querySelector(".hints");
const resultsList = document.querySelector(".results");
let resultsArr = [];

function debounce(fn, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn.apply(context, args), delay);
  };
}

const parseItem = (item) => {
  let { full_name, html_url, stargazers_count: stars } = item;
  let [owner, name] = full_name.split("/");
  return [name, { name, owner, html_url, stars }];
};

const clearList = (list) => {
  while (list.firstChild) list.removeChild(list.firstChild);
};

//========================================

const renderData = (items) => {
  const hints = [];
  resultsArr = [];
  items.forEach((item) => {
    let [hint, result] = parseItem(item);
    hints.push(hint);
    resultsArr.push(result);
  });
  hintsList.addEventListener("click", hintsListener);

  renderHints(hints);
};

const renderHints = (hints) => {
  clearList(hintsList);
  let order = 0;
  // Просто фрагмент который собирает элементы и расстворяется при добавлении в разметку
  let hintCollect = new DocumentFragment();
  for (let hint of hints) {
    let hintElement = document.createElement("li");
    hintElement.classList.add("hints__item");
    hintElement.dataset.order = order++;
    hintElement.append(hint);
    hintCollect.append(hintElement);
  }
  hintsList.append(hintCollect);
};

const renderResult = (result) => {
  let resultCollect = new DocumentFragment();
  let resultElement = document.createElement("li");
  resultElement.classList.add("results__item");
  resultElement.insertAdjacentHTML(
    "afterbegin",
    `<ul><li><a target="_blank" href="${result.html_url}"><span>Name:</span> ${result.name}</a></li>
        <li><span>Owner:</span> ${result.owner}</li><li><span>Stars:</span> ${result.stars}</li></ul>`
  );
  resultElement.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="x" tabindex="1" />`
  );
  resultCollect.append(resultElement);
  resultsList.append(resultCollect);
  resultsArr = [];
};

// ==============

const requestData = (qualifier) => {
  const requestURL = `https://api.github.com/search/repositories?q=${qualifier.replaceAll(
    /[\s]+/g,
    "+"
  )}&per_page=5`;

  fetch(requestURL)
    .then((response) => response.json())
    .then((data) => {
      renderData(data.items);
    })
    .catch((error) => console.error(error));
};

const debRequest = debounce(requestData, 300);

// ========================================

searchField.addEventListener("input", function () {
  if (this.value === "") {
    clearList(hintsList);
    resultsArr = [];
  } else {
    debRequest(this.value);
  }
});

const resultListener = function (event) {
  let hit = event.target;
  if (hit.tagName === "BUTTON") {
    const resultsItem = hit.closest(".results__item");
    const parent = resultsItem.closest(".results");
    parent.removeChild(resultsItem);
    if (parent.children.length < 1)
      resultsList.removeEventListener("click", resultListener);
  }
};

const hintsListener = function (event) {
  let hit = event.target;
  if (hit.tagName === "LI") {
    searchField.value = "";
    let order = hit.dataset.order;
    if (resultsList.children.length < 1)
      resultsList.addEventListener("click", resultListener);
    renderResult(resultsArr[order]);
    clearList(hintsList);
    hintsList.removeEventListener("click", hintsListener);
  }
};
