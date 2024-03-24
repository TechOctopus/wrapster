import { products } from "../data/products.js";

const filterProducts = (products, filter) => {
  if (!products || !products.length || !filter) {
    return [];
  }

  if (countFilters(filter) === "") {
    return products;
  }

  let filteredProducts = [...products];

  // Filter by min and max price
  if (filter.price && filter.price.min !== undefined && filter.price.max !== undefined) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filter.price.min && product.price <= filter.price.max
    );
  }

  // Filter by device
  if (filter.device && filter.device.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filter.device.includes(product.device)
    );
  }

  // Filter by collection
  if (filter.collection && filter.collection.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filter.collection.includes(product.collection.id)
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

  // Sort by device
  if (filter.sort && filter.sort.orderByDevice) {
    if (filter.sort.orderByDevice === "asc") {
      filteredProducts.sort((a, b) => a.device.localeCompare(b.device));
    }
  }

  // Search by name
  if (filter.search && filter.search.query !== "") {
    filteredProducts = filteredProducts.filter(product => {
      const productInfo = `${product.collection.name} ${product.collection.label} ${product.device} ${product.collection.description} ${product.price}`;
      return productInfo.toLowerCase().includes(filter.search.query.toLowerCase());
    });
  }

  return filteredProducts;
};

const countFilters = (filter) => {
  let count = 0;

  if (filter.device && filter.device.length > 0) {
    count += filter.device.length;
  }

  if (filter.collection && filter.collection.length > 0) {
    count += filter.collection.length;
  }

  if (filter.price && (filter.price.min !== undefined || filter.price.max !== undefined)) {
    count++;
  }

  if (filter.sort && (filter.sort.orderByPrice || filter.sort.orderByDevice)) {
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
      <div class="w-full aspect-[1/1] overflow-hidden rounded-md group-hover:opacity-75 p-4 bg-gray-50">
          <img
              src="${product.image[0]}"
              alt="${product.collection.name}"
              class="object-fit w-full aspect-[1/1] object-contain object-center"
          />
      </div>
      <h3 class="mt-4 text-sm text-gray-700">
          <a href="product.html">
              <span class="absolute inset-0"></span>
              ${product.collection.name}
          </a>
      </h3>
      <p class="mt-1 text-sm text-gray-500">${product.collection.label}</p>
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
    // Filter by device
    device: createProxiedProperty([],
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
      orderByDevice: undefined,
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
    filterMenuState ?
      filterMenuElement.classList.remove("hidden"):
      filterMenuElement.classList.add("hidden");
  });

  const searchInputElement = document.getElementById("search");
  searchInputElement.addEventListener("input", (event) => {
    filter.search.query = event.target.value;
  });

  const filterFormElemt = document.getElementById("filter-form");

  let menuState = false
  const menuButtonElement = document.getElementById("menu-button");
  const menuElement = document.getElementById("menu");

  menuButtonElement.addEventListener("click", () => {
    menuState = !menuState;
    menuState ?
      menuElement.classList.remove("hidden"):
      menuElement.classList.add("hidden");
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
        filter.sort.orderByDevice = undefined;
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
          case "Lowest Price": filter.sort.orderByPrice = "asc"; break;
          case "Highest Price": filter.sort.orderByPrice = "desc"; break;
          case "Device": filter.sort.orderByDevice = "asc"; break;
        }
      }

      menuState = false;
      menuElement.classList.add("hidden");
    });
  });

  const priceFilterElement = document.getElementById("price-filter");
  priceFilterElement.addEventListener("change", (event) => {
    [filter.price.min, filter.price.max] = event.target.value.split("-");
  });

  const deviceFilterElement = document.getElementById("device-filter");
  deviceFilterElement.addEventListener("change", (event) => {
    event.target.checked
      ? filter.device.push(event.target.value)
      : filter.device.splice(filter.device.indexOf(event.target.value), 1);
  });

  const collectionFilterElement = document.getElementById("collection-filter");
  collectionFilterElement.addEventListener("change", (event) => {
    event.target.checked
      ? filter.collection.push(event.target.value)
      : filter.collection.splice(filter.collection.indexOf(event.target.value), 1);
  });

  const clearFilterElement = document.getElementById("clear-filters");
  clearFilterElement.addEventListener("click", () => {
    filterMenuElement.classList.add("hidden");
    filterMenuState = false;
    menuElement.classList.add("hidden");
    searchInputElement.value = "";
    menuState = false;
    if (countFilters(filter) !== "") {
      filter = createFilterState(products);
      filterFormElemt.reset();
      menuItemsElements.forEach((menuItemElement) => {
        menuItemElement.className = "text-gray-500 block px-4 py-2 text-sm hover:bg-indigo-100";
      });
      menuItemState.active = undefined;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
});
