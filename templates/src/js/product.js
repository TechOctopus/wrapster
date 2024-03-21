import Carousel from './Carousel.js';
import { products } from "../data/products.js";

const renderCarousel = () => {
  const carouselElement = document.getElementById('carousel-example');

  const items = [
    {
      position: 0,
      el: document.getElementById('carousel-item-1'),
    },
    {
      position: 1,
      el: document.getElementById('carousel-item-2'),
    }
  ];

  // options with default values
  const options = {
    defaultPosition: 1,
    interval: 3000,

    indicators: {
      activeClasses: 'bg-white dark:bg-gray-800',
      inactiveClasses:
        'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
      items: [
        {
          position: 0,
          el: document.getElementById('carousel-indicator-1'),
        },
        {
          position: 1,
          el: document.getElementById('carousel-indicator-2'),
        }
      ],
    },
  };

  // instance options object
  const instanceOptions = {
    id: 'carousel-example',
    override: true
  };

  // create new instance of Carousel
  const carousel = new Carousel(carouselElement, items, options, instanceOptions);

  const prevButton = document.getElementById('data-carousel-prev');
  const nextButton = document.getElementById('data-carousel-next');

  prevButton.addEventListener('click', () => {
    carousel.prev();
  });

  nextButton.addEventListener('click', () => {
    carousel.next();
  });
};

const renderMoreProducts = () => {
  const moreProductsElement = document.getElementById('more-products');

  let indexes = new Set();
  while (indexes.size < 4) {
    indexes.add(Math.floor(Math.random() * products.length));
  }

  const moreProducts = Array.from(indexes).map((index) => {
    return products[index];
  });

  moreProductsElement.innerHTML = '';
  moreProducts.map((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('group', 'relative', 'cursor-pointer');
    productElement.innerHTML = `
      <div class="w-full aspect-[1/1] overflow-hidden rounded-md group-hover:opacity-75 p-4 bg-gray-50">
          <img
              src="${product.image[0]}"
              alt="${product.collection.name}"
              class="object-fit w-full aspect-[1/1] object-contain object-center"
          />
      </div>
      <h3 class="mt-4 text-sm text-gray-700">
          <a href="./product.html">
              <span class="absolute inset-0"></span>
              ${product.collection.name}
          </a>
      </h3>
      <p class="mt-1 text-sm text-gray-500">${product.collection.label}</p>
      <p class="mt-1 text-sm font-medium text-gray-900">$${product.price}</p>
    `;
    moreProductsElement.appendChild(productElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCarousel();
  renderMoreProducts();
});
