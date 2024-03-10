/*
  THIS CODE IS MODIFIED VERSION OF THE ORIGINAL CODE FROM THE FOLLOWING SOURCE:
  https://github.com/themesberg/flowbite/blob/main/src/components/carousel/index.ts
 */

const Default = {
  defaultPosition: 0,
  indicators: {
    items: [],
    activeClasses: 'bg-white dark:bg-gray-800',
    inactiveClasses:
      'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
  },
  interval: 3000,
  onNext: () => {},
  onPrev: () => {},
  onChange: () => {},
};

const DefaultInstanceOptions = {
  id: null,
  override: true,
};

class Carousel {
  _instanceId
  _carouselEl
  _items
  _indicators
  _activeItem
  _intervalDuration
  _intervalInstance
  _options
  _initialized

  constructor(
    carouselEl,
    items,
    options,
    instanceOptions
  ) {
    this._instanceId = instanceOptions.id
      ? instanceOptions.id
      : carouselEl.id;
    this._carouselEl = carouselEl;
    this._items = items;
    this._options = {
      ...Default,
      ...options,
      indicators: { ...Default.indicators, ...options.indicators },
    };
    this._activeItem = this.getItem(this._options.defaultPosition);
    this._indicators = this._options.indicators.items;
    this._intervalDuration = this._options.interval;
    this._intervalInstance = null;
    this._initialized = false;
    this.init();
  }

  /**
   * initialize carousel and items based on active one
   */
  init() {
    if (this._items.length && !this._initialized) {
      this._items.map((item) => {
        item.el.classList.add(
          'absolute',
          'inset-0',
          'transition-transform',
          'transform'
        );
      });

      // if no active item is set then first position is default
      if (this.getActiveItem()) {
        this.slideTo(this.getActiveItem().position);
      } else {
        this.slideTo(0);
      }

      this._indicators.map((indicator, position) => {
        indicator.el.addEventListener('click', () => {
          this.slideTo(position);
        });
      });

      this._initialized = true;
    }
  }

  destroy() {
    if (this._initialized) {
      this._initialized = false;
    }
  }

  getItem(position) {
    return this._items[position];
  }

  /**
   * Slide to the element based on id
   * @param {*} position
   */
  slideTo(position) {
    const nextItem = this._items[position];
    const rotationItems = {
      left:
        nextItem.position === 0
          ? this._items[this._items.length - 1]
          : this._items[nextItem.position - 1],
      middle: nextItem,
      right:
        nextItem.position === this._items.length - 1
          ? this._items[0]
          : this._items[nextItem.position + 1],
    };
    this._rotate(rotationItems);
    this._setActiveItem(nextItem);
    if (this._intervalInstance) {
      this.pause();
      this.cycle();
    }

    this._options.onChange(this);
  }

  /**
   * Based on the currently active item it will go to the next position
   */
  next() {
    const activeItem = this.getActiveItem();
    let nextItem = null;

    // check if last item
    if (activeItem.position === this._items.length - 1) {
      nextItem = this._items[0];
    } else {
      nextItem = this._items[activeItem.position + 1];
    }

    this.slideTo(nextItem.position);

    // callback function
    this._options.onNext(this);
  }

  /**
   * Based on the currently active item it will go to the previous position
   */
  prev() {
    const activeItem = this.getActiveItem();
    let prevItem = null;

    // check if first item
    if (activeItem.position === 0) {
      prevItem = this._items[this._items.length - 1];
    } else {
      prevItem = this._items[activeItem.position - 1];
    }

    this.slideTo(prevItem.position);

    // callback function
    this._options.onPrev(this);
  }

  /**
   * This method applies the transform classes based on the left, middle, and right rotation carousel items
   * @param {*} rotationItems
   */
  _rotate(rotationItems) {
    // reset
    this._items.map((item) => {
      item.el.classList.add('hidden');
    });

    // Handling the case when there is only one item
    if (this._items.length === 1) {
      rotationItems.middle.el.classList.remove(
        '-translate-x-full',
        'translate-x-full',
        'translate-x-0',
        'hidden',
        'z-10'
      );
      rotationItems.middle.el.classList.add('translate-x-0', 'z-20');
      return;
    }

    // left item (previously active)
    rotationItems.left.el.classList.remove(
      '-translate-x-full',
      'translate-x-full',
      'translate-x-0',
      'hidden',
      'z-20'
    );

    rotationItems.left.el.classList.add('-translate-x-full', 'z-10');

    // currently active item
    rotationItems.middle.el.classList.remove(
      '-translate-x-full',
      'translate-x-full',
      'translate-x-0',
      'hidden',
      'z-10'
    );
    rotationItems.middle.el.classList.add('translate-x-0', 'z-30');

    // right item (upcoming active)
    rotationItems.right.el.classList.remove(
      '-translate-x-full',
      'translate-x-full',
      'translate-x-0',
      'hidden',
      'z-30'
    );
    rotationItems.right.el.classList.add('translate-x-full', 'z-20');
  }

  /**
   * Set an interval to cycle through the carousel items
   */
  cycle() {
    if (typeof window !== 'undefined') {
      this._intervalInstance = window.setInterval(() => {
        this.next();
      }, this._intervalDuration);
    }
  }

  /**
   * Clears the cycling interval
   */
  pause() {
    clearInterval(this._intervalInstance);
  }

  /**
   * Get the currently active item
   */
  getActiveItem() {
    return this._activeItem;
  }

  /**
   * Set the currently active item and data attribute
   * @param {*} position
   */
  _setActiveItem(item) {
    this._activeItem = item;
    const position = item.position;

    // update the indicators if available
    if (this._indicators.length) {
      this._indicators.map((indicator) => {
        indicator.el.setAttribute('aria-current', 'false');
        indicator.el.classList.remove(
          ...this._options.indicators.activeClasses.split(' ')
        );
        indicator.el.classList.add(
          ...this._options.indicators.inactiveClasses.split(' ')
        );
      });
      this._indicators[position].el.classList.add(
        ...this._options.indicators.activeClasses.split(' ')
      );
      this._indicators[position].el.classList.remove(
        ...this._options.indicators.inactiveClasses.split(' ')
      );
      this._indicators[position].el.setAttribute('aria-current', 'true');
    }
  }

  updateOnNext(callback) {
    this._options.onNext = callback;
  }

  updateOnPrev(callback) {
    this._options.onPrev = callback;
  }

  updateOnChange(callback) {
    this._options.onChange = callback;
  }
}

export function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(($carouselEl) => {
    const interval = $carouselEl.getAttribute('data-carousel-interval');
    const slide =
      $carouselEl.getAttribute('data-carousel') === 'slide'
        ? true
        : false;

    const items = [];
    let defaultPosition = 0;
    if ($carouselEl.querySelectorAll('[data-carousel-item]').length) {
      Array.from(
        $carouselEl.querySelectorAll('[data-carousel-item]')
      ).map(($carouselItemEl, position) => {
        items.push({
          position: position,
          el: $carouselItemEl,
        });

        if (
          $carouselItemEl.getAttribute('data-carousel-item') ===
          'active'
        ) {
          defaultPosition = position;
        }
      });
    }

    const indicators = [];
    if ($carouselEl.querySelectorAll('[data-carousel-slide-to]').length) {
      Array.from(
        $carouselEl.querySelectorAll('[data-carousel-slide-to]')
      ).map(($indicatorEl) => {
        indicators.push({
          position: parseInt(
            $indicatorEl.getAttribute('data-carousel-slide-to')
          ),
          el: $indicatorEl,
        });
      });
    }

    const carousel = new Carousel($carouselEl, items, {
      defaultPosition: defaultPosition,
      indicators: {
        items: indicators,
      },
      interval: interval ? interval : Default.interval,
    });

    if (slide) {
      carousel.cycle();
    }

    // check for controls
    const carouselNextEl = $carouselEl.querySelector(
      '[data-carousel-next]'
    );
    const carouselPrevEl = $carouselEl.querySelector(
      '[data-carousel-prev]'
    );

    if (carouselNextEl) {
      carouselNextEl.addEventListener('click', () => {
        carousel.next();
      });
    }

    if (carouselPrevEl) {
      carouselPrevEl.addEventListener('click', () => {
        carousel.prev();
      });
    }
  });
}

if (typeof window !== 'undefined') {
  window.Carousel = Carousel;
  window.initCarousels = initCarousels;
}

export default Carousel;
