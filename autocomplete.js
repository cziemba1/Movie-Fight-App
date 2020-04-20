const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Search </b></label>
        <input type="text" class="input">
        <div class="dropdown list-below">
            <div class="dropdown-menu">
            <div class="dropdown-content results">
        </div>
    </div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  //to do not call input too often
  const onInput = async (event) => {
    const items = await fetchData(event.target.value);

    //when searching, do not show empty dropdown list
    if (!items.length) {
      DeferredPermissionRequest.classList.remove("is-active");
      return;
    }

    //when searching, clean existing list
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active"); //open dropdown menu
    for (let item of items) {
      const option = document.createElement("a"); //dropdown item/option

      option.classList.add("dropdown-item"); //class for Bulma
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInput, 500));
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
