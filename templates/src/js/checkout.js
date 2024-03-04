document.addEventListener("DOMContentLoaded", () => {
  const deliveryMethodElements = [
    {
      mark: document.getElementById("delivery_method_0_mark"),
      label: document.getElementById("delivery_method_0_label"),
      input: document.getElementById("delivery_method_0_input"),
    },
    {
      mark: document.getElementById("delivery_method_1_mark"),
      label: document.getElementById("delivery_method_1_label"),
      input: document.getElementById("delivery_method_1_input"),
    },
  ]

  deliveryMethodElements.forEach((methodElement) => {
    methodElement.input.addEventListener("change", () => {
      deliveryMethodElements.forEach((methodElement) => {
        if (methodElement.input.checked) {
          methodElement.label.classList.add("border-primary-500");
          methodElement.mark.classList.remove("hidden");
          methodElement.input.checked = true;
        } else {
          methodElement.label.classList.remove("border-primary-500");
          methodElement.mark.classList.add("hidden");
          methodElement.input.checked = false;
        }
      });
    });
  });
});
