searchField.addEventListener("input", function () {
  if (this.value === "") {
    clearList(hintsList);
    resultsArr = [];
  } else {
    debRequest(this.value);
  }
});

searchField.addEventListener("change", function () {
  //console.log('change', this.value);
});

searchField.addEventListener("keyup", function (evt) {
  if (evt.keyCode === "13") {
    //console.log('key ENTER');
  }
});

sForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  //console.log('submit');
});

resultsList.addEventListener("click", function (evt) {
  let hit = evt.target;
  if (hit.tagName === "BUTTON") {
    const resultsItem = hit.closest(".results__item");
    //resultsItem.classList.add('hidden');
    resultsItem.closest(".results").removeChild(resultsItem);
  }
});

hintsList.addEventListener("click", function (evt) {
  let hit = evt.target;
  if (hit.tagName === "LI") {
    searchField.value = "";
    let ord = hit.dataset.ord;
    renderResult(resultsArr[ord]);
    clearList(hintsList);
  }
});
