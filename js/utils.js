const searchField = document.querySelector(".search");
const sForm = document.querySelector(".search-form");
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
