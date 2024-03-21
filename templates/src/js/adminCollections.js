import { collections } from "../data/collections.js";

const showProducts = () => {
  const allCollectionsElement = document.getElementById("all-collections");
  allCollectionsElement.innerHTML = "";

  collections.forEach((collection) => {
    const collectionElement = document.createElement("li");
    collectionElement.className = "flex py-6 sm:py-10";
    collectionElement.innerHTML = `
      <div class="flex flex-col justify-between sm:grid sm:grid-cols-4">
          <div class="col-span-3">
              <h3 class="text-md">${collection.name}</h3>
              <h2 class="text-sm">${collection.label}</h2>
              <p class="mt-1 text-sm text-gray-500">${collection.description}</p>
          </div>
          <div class="flex flex-col items-start sm:ml-auto">
               <button
                   onclick="window.location.href = './edit-collection.html'"
                   type="button"
                   class="text-sm font-medium text-primary-600 hover:text-indigo-500 mt-4 sm:mt-0"
               >
                   Edit collection
               </button>
               <button
                   type="button"
                   class="text-sm font-medium text-red-600 hover:text-red-500 mt-2"
               >
                   Delete collection
               </button>
          </div>
      </div>
    `;
    allCollectionsElement.appendChild(collectionElement);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  showProducts();
});
