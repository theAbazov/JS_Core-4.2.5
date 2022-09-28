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
  renderHints(hints);
};

const renderHints = (hints) => {
  clearList(hintsList);
  let order = 0;
  // Просто фрагмент который расстворяется при добавлении в разметку
  let fragment = new DocumentFragment();
  for (let h of hints) {
    let li = document.createElement("li");
    li.classList.add("hints__item");
    li.dataset.order = order++;
    li.append(h);
    fragment.append(li);
  }
  hintsList.append(fragment);
};

const renderResult = (result) => {
  let fragment = new DocumentFragment();
  let li = document.createElement("li");
  li.classList.add("results__item");
  li.insertAdjacentHTML(
    "afterbegin",
    `<ul><li><a target="_blank" href="${result.html_url}"><span>Name:</span> ${result.name}</a></li>
        <li><span>Owner:</span> ${result.owner}</li><li><span>Stars:</span> ${result.stars}</li></ul>`
  );
  li.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="x" tabindex="1" />`
  );
  fragment.append(li);
  resultsList.append(fragment);
  resultsArr = [];
};

// ==============

const requestData = (q) => {
  const requestURL = `https://api.github.com/search/repositories?q=${q.replaceAll(
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

resultsList.addEventListener("click", function (event) {
  let hit = event.target;
  if (hit.tagName === "BUTTON") {
    const resultsItem = hit.closest(".results__item");
    resultsItem.closest(".results").removeChild(resultsItem);
  }
});

hintsList.addEventListener("click", function (event) {
  let hit = event.target;
  if (hit.tagName === "LI") {
    searchField.value = "";
    let order = hit.dataset.order;
    renderResult(resultsArr[order]);
    clearList(hintsList);
  }
});
