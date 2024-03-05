import { products } from "../data/data.js";

const filterProducts = (products, filter) => {
  if (!products || !products.length || !filter) {
    return [];
  }

  let filteredProducts = [...products];

  // Filter by min and max price
  if (filter.price && filter.price.min !== undefined && filter.price.max !== undefined) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filter.price.min && product.price <= filter.price.max
    );
  }

  // Filter by model
  if (filter.model && filter.model.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filter.model.includes(product.model)
    );
  }

  // Filter by collection
  if (filter.collection && filter.collection.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filter.collection.includes(product.collection)
    );
  }

  // Sort by price
  if (filter.sort && filter.sort.orderByPrice) {
     switch (filter.sort.orderByPrice) {
       case "asc":
         filteredProducts.sort((a, b) => a.price - b.price);
         break;
       case "desc":
         filteredProducts.sort((a, b) => b.price - a.price);
         break;
     }
   }

  // Sort by model
  if (filter.sort && filter.sort.orderByModel) {
    if (filter.sort.orderByModel === "asc") {
      filteredProducts.sort((a, b) => a.model.localeCompare(b.model));
    }
  }

  // Search by name
  if (filter.search && filter.search.query !== "") {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(filter.search.query.toLowerCase())
    );
  }

  return filteredProducts;
};

const countFilters = (filter) => {
  let count = 0;

  if (filter.model && filter.model.length > 0) {
    count += filter.model.length;
  }

  if (filter.collection && filter.collection.length > 0) {
    count += filter.collection.length;
  }

  if (filter.price && (filter.price.min !== undefined || filter.price.max !== undefined)) {
    count++;
  }

  if (filter.search && filter.search.query !== "") {
    count++;
  }

  return count || "";
};

const showProducts = (products, filter) => {
  const filteredProducts = filterProducts(products, filter);
  renderMenu(filteredProducts, countFilters(filter));
};

const renderMenu = (products, filtersNumber) => {
  const filterTextElement = document.getElementById("filters-text");
  filterTextElement.innerText = `${filtersNumber} Filter${filtersNumber !== 1 ? 's' : ''}`;

  const productsContainerElement = document.getElementById("products-container");
  productsContainerElement.innerHTML = "";

  if (products.length === 0) {
    productsContainerElement.innerHTML = createEmptyProductsHTML();
  }
  else {
    products.forEach(product => {
      const productElement = createProductsHTML(product);
      productsContainerElement.innerHTML += productElement;
    });
  }
};

const createEmptyProductsHTML = () => `
  <div class="h-96 w-full flex items-center justify-center col-span-full flex-col">
      <h2 class="text-lg font-medium text-gray-900">Sorry, no products found</h2>
      <p class="mt-1 text-sm text-gray-500">Please clear the filters to see all products</p>
  </div>
`;

const createProductsHTML = (product) => `
  <div class="group relative">
      <div class="bg-w h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80 p-4">
          <img
              width=180
              height=320
              src="${product.image}"
              alt="${product.name}"
              class="object-fit h-full w-full object-contain object-center"
          />
      </div>
      <h3 class="mt-4 text-sm text-gray-700">
          <a href="product.html">
              <span class="absolute inset-0"></span>
              ${product.name}
          </a>
      </h3>
      <p class="mt-1 text-sm text-gray-500">${product.label}</p>
      <p class="mt-1 text-sm font-medium text-gray-900">$${product.price}</p>
  </div>
`;

const createProxiedProperty = (property, updateUI) => {
  return new Proxy(property, {
    set: (target, property, value) => {
      target[property] = value;
      updateUI();
      return true;
    },
  });
};

// Filter state generator, it returns a proxy object that updates the UI when the state changes
const createFilterState = (products) => {
  const filter = {
    // Filter by model
    model: createProxiedProperty([],
      () => showProducts(products, filter)),
    // Filter by price
    price: createProxiedProperty({
      min: undefined, max: undefined
    }, () => showProducts(products, filter)),
    // Filter by collection
    collection: createProxiedProperty([],
      () => showProducts(products, filter)),
    // Sorting
    sort: createProxiedProperty({
      orderByPrice: undefined,
      orderByModel: undefined,
    }, () => showProducts(products, filter)),
    // Search
    search: createProxiedProperty({
      query: ""
    }, () => showProducts(products, filter))
  };
  showProducts(products, filter);
  return filter;
};

const renderFilters = () => {
  let filter = createFilterState(products);

  let filterMenuState = false;

  const filtersButtonElement = document.getElementById("filters-button");
  const filterMenuElement = document.getElementById("filters-menu");

  filtersButtonElement.addEventListener("click", () => {
    filterMenuState = !filterMenuState;
    filterMenuElement.style.display = filterMenuState ? "block" : "none";
  });

  const searchInputElement = document.getElementById("search");
  searchInputElement.addEventListener("input", (event) => {
    filter.search.query = event.target.value;
    console.log(filter.search.query);
  });

  const filterFormElemt = document.getElementById("filter-form");

  let menuState = false
  const menuButtonElement = document.getElementById("menu-button");
  const menuElement = document.getElementById("menu");

  menuButtonElement.addEventListener("click", () => {
    menuState = !menuState;
    menuElement.style.display = menuState ? "block" : "none";
  });

  const menuItemsElements = [
    document.getElementById("menu-item-0"),
    document.getElementById("menu-item-1"),
    document.getElementById("menu-item-2"),
  ];

  const menuItemState = { active: undefined };

  menuItemsElements.forEach((menuItemElement) => {
    menuItemElement.addEventListener("click", (event) => {
      if (menuItemState.active === event.target.id) {
        menuItemElement.className = "text-gray-500 block px-4 py-2 text-sm hover:bg-indigo-100";
        menuItemState.active = undefined;
        filter.sort.orderByPrice = undefined;
        filter.sort.orderByModel = undefined;
      }
      else {

        if (menuItemState.active !== undefined) {
          menuItemsElements.forEach((menuItemElement) => {
            menuItemElement.className = "text-gray-500 block px-4 py-2 text-sm hover:bg-indigo-100";
          });
        }

        menuItemState.active = event.target.id;
        menuItemElement.className = "bg-gray-100 font-medium text-gray-900 block px-4 py-2 text-sm hover:bg-gray-200";
        switch (event.target.innerText) {
          case "Lowest Price":
            filter.sort.orderByPrice = "asc";
            break;
          case "Highest Price":
            filter.sort.orderByPrice = "desc";
            break;
          case "Model":
            filter.sort.orderByModel = "asc";
            break;
        }
      }

      menuState = false;
      menuElement.style.display = "none";
    });
  });

  const priceFilterElement = document.getElementById("price-filter");
  priceFilterElement.addEventListener("change", (event) => {
    [filter.price.min, filter.price.max] = event.target.value.split("-");
  });

  const modelFilterElement = document.getElementById("model-filter");
  modelFilterElement.addEventListener("change", (event) => {
    event.target.checked
      ? filter.model.push(event.target.value)
      : filter.model.splice(filter.model.indexOf(event.target.value), 1);
  });

  const collectionFilterElement = document.getElementById("collection-filter");
  collectionFilterElement.addEventListener("change", (event) => {
    event.target.checked
      ? filter.collection.push(event.target.value)
      : filter.collection.splice(filter.collection.indexOf(event.target.value), 1);
  });

  const clearFilterElement = document.getElementById("clear-filters");
  clearFilterElement.addEventListener("click", () => {
    filterMenuElement.style.display = "none";
    if (countFilters(filter) > 0) {
      filter = createFilterState(products);
      filterFormElemt.reset();
    }
    searchInputElement.value = "";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
});
