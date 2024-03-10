import { products } from "../data/data.js";

const showProducts = () => {
  const allProductsElement = document.getElementById("all-products");
  allProductsElement.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("li");
    productElement.className = "flex py-6 sm:py-10";
    productElement.innerHTML = `
          <div class="flex gap-3">
              <img 
                  src="${product.image[0]}"
                  alt="${product.name + "_0"}"
                  class="h-24 w-24 rounded-lg object-contain object-center sm:h-32 sm:w-32 bg-gray-100 p-2"
              />
              <img 
                  src="${product.image[1]}"
                  alt="${product.name + "_1"}"
                  class="h-24 w-24 rounded-lg object-contain object-center sm:h-32 sm:w-32 bg-gray-100 p-2"
              />
          </div>

          <div class="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
              <div>
                  <div class="flex justify-between sm:grid sm:grid-cols-2">
                      <div class="pr-6">
                          <h3 class="text-md">${product.name}</h3>
                          <h2 class="text-sm">${product.label}</h2>
                          <p class="mt-1 text-sm text-gray-500">${product.description}</p>
                          <p class="mt-1 text-sm text-gray-500">${product.model}</p>
                      </div>

                      <p class="text-right text-sm font-medium text-gray-900">$${product.price}</p>
                  </div>

                  <div class="flex flex-col items-start sm:absolute sm:left-1/2 sm:top-0 sm:mt-0">
                      <button
                          onclick="window.location.href = './edit-product.html'"
                          type="button"
                          class="text-sm font-medium text-primary-600 hover:text-indigo-500 mt-4 sm:mt-0"
                      >
                          Edit product
                      </button>
                      <button
                          type="button"
                          class="text-sm font-medium text-red-600 hover:text-red-500 mt-2"
                      >
                          Delete product
                      </button>
                  </div>
              </div>

              <p class="mt-4 flex space-x-2 text-sm text-gray-700">
                  ${product.count} in stock
              </p>
          </div>
    `;
    allProductsElement.appendChild(productElement);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  showProducts();
});
