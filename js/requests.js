const requestData = (q) => {
  const requestURL = `https://api.github.com/search/repositories?q=${q.replaceAll(
    /[\s]+/g,
    "+"
  )}&per_page=5`;

  fetch(requestURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderData(data.items);
    })
    .catch((error) => console.log(error));
};

const debRequest = debounce(requestData, 300);
