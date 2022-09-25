const renderData = (items) => {
  const hints = [];
  resultsArr = [];
  items.forEach((item) => {
    let [hint, result] = parseItem(item);
    hints.push(hint);
    resultsArr.push(result);
  });
  // prepare hints
  renderHints(hints);
};

const renderHints = (hints) => {
  clearList(hintsList);
  let ord = 0;
  let fragment = new DocumentFragment();
  for (let h of hints) {
    let li = document.createElement("li");
    li.classList.add("hints__item");
    li.dataset.ord = ord++;
    li.append(h);
    fragment.append(li);
  }
  hintsList.append(fragment);
};

const renderResult = (r) => {
  let fragment = new DocumentFragment();
  console.dir(fragment);
  let li = document.createElement("li");
  li.classList.add("results__item");
  li.insertAdjacentHTML(
    "afterbegin",
    `<ul><li><a target="_blank" href="${r.html_url}"><span>Name:</span> ${r.name}</a></li>
      <li><span>Owner:</span> ${r.owner}</li><li><span>Stars:</span> ${r.stars}</li></ul>`
  );
  li.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="x" tabindex="1" />`
  );
  fragment.append(li);
  resultsList.append(fragment);
  resultsArr = [];
};
