import { products } from "../data/products.js";
import { productEditor } from "./productEditor.js";

document.addEventListener("DOMContentLoaded", x => {
  // change to get products from URL, right now it's just a placeholder
  const product = products[Math.floor(Math.random() * products.length)];
  productEditor(product);
});
