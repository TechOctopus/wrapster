const createProductDetailsImage = (product) => `
  <img
      width="20"
      height="20"
      src="${product.image}"
      alt="${product.name}"
      class="object-contain object-center"
  />
`;

const createProductDetailsIcon = () => `
  <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
  </svg>
`;

const createProductPreviewImage = (product) => `
  <img
      width="400"
      height="400"
      src="${product.image}"
      alt="${product.name}"
      class="object-fit h-full w-full object-contain object-center"
      id="preview-image"
  />
`;

const initDetailsElements = (product) => {
  const productDetailsElements = {
    name: document.getElementById("product-name"),
    label: document.getElementById("product-label"),
    price: document.getElementById("product-price"),
    count: document.getElementById("product-count"),
    model: document.getElementById("product-model"),
    image: document.getElementById("product-image"),
    cover: document.getElementById("product-image-cover"),
    container: document.getElementById("product-image-container"),
    description: document.getElementById("product-description")
  };

  // If product is undefined, then it's a new product with no details
  if (product !== undefined) {
    Array.from(Object.keys(productDetailsElements)).forEach((key) => {
      if(["name", "price", "label", "description", "model", "count"].includes(key)) {
        productDetailsElements[key].value = product[key];
      }
    });

    productDetailsElements.cover.innerHTML = createProductDetailsImage(product);
  }

  return productDetailsElements;
};

const initPreviewElements = (product) => {
  const productPreviewElements = {
    name: document.getElementById("preview-name"),
    label: document.getElementById("preview-label"),
    price: document.getElementById("preview-price"),
    description: document.getElementById("preview-description"),
    image: document.getElementById("preview-image")
  };

  if (product !== undefined) {
    Array.from(Object.keys(productPreviewElements)).forEach((key) => {
      if(["name", "label"].includes(key)) {
        productPreviewElements[key].textContent = product[key];
      }
      if("price" === key) {
        productPreviewElements[key].textContent = product[key].toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });
      }
    });

    productPreviewElements.image.innerHTML = createProductPreviewImage(product);
  }

  return productPreviewElements;
};

const stopDefaultBehavior = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

const renderImages = (productDetailsElements, productPreviewElements, file) => {
  productDetailsElements.cover.innerHTML = createProductDetailsImage({
    image: file.image,
    name: file.name
  });

  productPreviewElements.image.innerHTML = createProductPreviewImage({
    image: file.image,
    name: file.name
  });
};

export const productEditor = (product) => {
  const productDetailsElements = initDetailsElements(product);
  const productPreviewElements = initPreviewElements(product);

  Array.from(Object.keys(productDetailsElements)).forEach((key) => {
    productDetailsElements[key].addEventListener("input", (event) => {

      if (["name", "label"].includes(key)) {
        event.target.value === "" ?
          productPreviewElements[key].textContent = "Product " + key :
          productPreviewElements[key].textContent = event.target.value;
      }

      if (key === "image") {
        if (event.target.files.length === 0) {
          productDetailsElements.cover.innerHTML = createProductDetailsIcon();
        }
        else {
          renderImages(
            productDetailsElements,
            productPreviewElements,
            {
              image: URL.createObjectURL(event.target.files[0]),
              name: event.target.files[0].name
            }
          );
        }
      }

      if (key === "price") {
        productPreviewElements[key].textContent = "$" + event.target.value;
      }
    });
  });

  productDetailsElements.container.addEventListener("drop", (event) => {
    stopDefaultBehavior(event);
    productDetailsElements.container.classList.remove("border-indigo-600");

    const dt = event.dataTransfer;
    const file = dt.files[0];

    productPreviewElements.image.innerHTML = createProductPreviewImage({
      image: URL.createObjectURL(file),
      name: file.name
    });

    productDetailsElements.cover.innerHTML = createProductDetailsImage({
      image: URL.createObjectURL(file),
      name: file.name
    });
  });

  productDetailsElements.container.addEventListener("dragover", (event) => {
    stopDefaultBehavior(event);
    productDetailsElements.container.classList.add("border-indigo-600");
  });

  productDetailsElements.container.addEventListener("dragleave", (event) => {
    stopDefaultBehavior(event);
    productDetailsElements.container.classList.remove("border-indigo-600");
  });

  productDetailsElements.container.addEventListener("dragenter", (event) => {
    stopDefaultBehavior(event);
  });
};
