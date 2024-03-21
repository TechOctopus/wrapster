import { products } from "../data/products.js";

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
    name: document.getElementById("product-collection"),
    price: document.getElementById("product-price"),
    count: document.getElementById("product-count"),
    device: document.getElementById("product-device"),
    images: [
      {
        container: document.getElementById("product-image-container-0"),
        image: document.getElementById("product-image-0"),
        cover: document.getElementById("product-image-cover-0"),
      },
      {
        container: document.getElementById("product-image-container-1"),
        image: document.getElementById("product-image-1"),
        cover: document.getElementById("product-image-cover-1"),
      }
    ],
  };

  // If product is undefined, then it's a new product with no details
  if (product !== undefined) {
    Array.from(Object.keys(productDetailsElements)).forEach((key) => {
      if(["price", "device", "count"].includes(key)) {
        productDetailsElements[key].value = product[key];
      }

      if("name" === key) {
        productDetailsElements[key].value = product.collection.name;
      }
    });

    productDetailsElements.images[0].cover.innerHTML = createProductDetailsImage({
      image: product.image[0],
      name: product.name + "front view"
    });

    productDetailsElements.images[1].cover.innerHTML = createProductDetailsImage({
      image: product.image[1],
      name: product.name + "back view"
    });
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
      if(["name", "label", "description"].includes(key)) {
        productPreviewElements[key].textContent = product.collection[key];
      }
      if("price" === key) {
        productPreviewElements[key].textContent = product[key].toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });
      }
    });

    productPreviewElements.image.innerHTML = createProductPreviewImage({
      image: product.image[0],
      name: product.name + "front view"
    });
  }

  return productPreviewElements;
};

const stopDefaultBehavior = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

export const productEditor = (product) => {
  const productDetailsElements = initDetailsElements(product);
  const productPreviewElements = initPreviewElements(product);

  ["name", "price"].forEach((key) => {
    productDetailsElements[key].addEventListener("input", (event) => {
      if (key === "name") {
        const collection = products.find((product) => product.collection.name === event.target.value).collection;

        console.log(collection);
        ["name", "label", "description"].forEach((element) => {
          console.log(productPreviewElements[element]);
          productPreviewElements[element].textContent = collection[element];
        });
      }
      if (key === "price") {
        productPreviewElements[key].textContent = "$" + event.target.value;
      }
    });
  });

  for (let i = 0; i < productDetailsElements.images.length; i++) {
    productDetailsElements.images[i].image.addEventListener("input", (event) => {
      if (event.target.files.length === 0) {
        productDetailsElements.images[0].cover.innerHTML = createProductDetailsIcon();
      }
      else {
        productDetailsElements.images[i].cover.innerHTML = createProductDetailsImage({
          image: URL.createObjectURL(event.target.files[0]),
          name: event.target.files[0].name
        });

        if (i === 0) {
          productPreviewElements.image.innerHTML = createProductPreviewImage({
            image: URL.createObjectURL(event.target.files[0]),
            name: event.target.files[0].name
          });
        }
      }
    });

    productDetailsElements.images[i].container.addEventListener("drop", (event) => {
      stopDefaultBehavior(event);
      productDetailsElements.images[i].container.classList.remove("border-indigo-600");

      const dt = event.dataTransfer;
      const file = dt.files[0];

      productDetailsElements.images[i].cover.innerHTML = createProductDetailsImage({
        image: URL.createObjectURL(file),
        name: file.name
      });

      if (i === 0) {
        productPreviewElements.image.innerHTML = createProductPreviewImage({
          image: URL.createObjectURL(file),
          name: file.name
        });
      }
    });

    productDetailsElements.images[i].container.addEventListener("dragover", (event) => {
      stopDefaultBehavior(event);
      productDetailsElements.images[i].container.classList.add("border-indigo-600");
    });

    productDetailsElements.images[i].container.addEventListener("dragleave", (event) => {
      stopDefaultBehavior(event);
      productDetailsElements.images[i].container.classList.remove("border-indigo-600");
    });

    productDetailsElements.images[i].container.addEventListener("dragenter", (event) => {
      stopDefaultBehavior(event);
    });
  }
};
