"use strict";
export function tags(tagID) {
  document.addEventListener("DOMContentLoaded", () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", `${tagID}`);
  });
}
export function fixedEl(el, px) {
  if (document.querySelector(`${el}`)) {
    el = document.querySelector(`${el}`);
    window.addEventListener("scroll", () => {
      if (window.scrollY > px) {
        el.classList.add("fixed");
      } else {
        el.classList.remove("fixed");
      }
    });
  }
}
export function burgerMenu(burger, menu) {
  if (document.querySelector(`${burger}`)) {
    burger = document.querySelector(`${burger}`);
    menu = document.querySelector(`${menu}`);
    const body = document.querySelector("body");
    burger.addEventListener("click", () => {
      if (!menu.classList.contains("active")) {
        menu.classList.add("active");
        burger.classList.add("active");
        body.classList.add("locked");
      } else {
        menu.classList.remove("active");
        burger.classList.remove("active");
        body.classList.remove("locked");
      }
    });
  }
}
export function selectEl(selector) {
  if (document.querySelector(`${selector}`)) {
    var x, i, j, l, ll, selElmnt, a, b, c;
    x = document.querySelectorAll(`${selector}`);
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow");
      });
    }
    function closeAllSelect(elmnt) {
      var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove("select-arrow");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    document.addEventListener("click", closeAllSelect);
  }
}
export function openTab(tabLink, tabContent, boxName) {
  if (document.querySelector(`${boxName}`)) {
    boxName = document.querySelector(`${boxName}`);
    tabLink = boxName.querySelectorAll(`${tabLink}`);
    tabContent = boxName.querySelectorAll(`${tabContent}`);
    tabLink.forEach((tabHeader) => {
      tabHeader.addEventListener("click", () => {
        const activeTab = tabHeader.dataset.tab;
        tabLink.forEach((header) => {
          header.classList.remove("active");
        });
        tabContent.forEach((content) => {
          content.classList.remove("active");
        });
        tabHeader.classList.add("active");
        const activeContent = boxName.querySelectorAll(
          `[data-tab="${activeTab}"]`
        )[1];
        activeContent.classList.add("active");
      });
    });
  }
}
export function createSwiper(swiperElement) {
  if (document.querySelector(`${swiperElement}`)) {
    return new Swiper(swiperElement, {
      direction: "horizontal",
      loop: !0,
      speed: 1000,
      slidesPerView: 1,
      spaceBetween: 0,
      autoHeight: true,
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
}
export function accordion(accordionHeader, accordionItems) {
  if (document.querySelector(`${accordionHeader}`)) {
    const items = document.querySelectorAll(`${accordionHeader}`);
    items.forEach((item) => {
      item.addEventListener("click", () => {
        const parent = item.parentNode;
        if (parent.classList.contains("show")) {
          parent.classList.remove("show");
        } else {
          document
            .querySelectorAll(`${accordionItems}`)
            .forEach((child) => child.classList.remove("show"));
          parent.classList.add("show");
        }
      });
    });
  }
}
export function scrollToElement(scrollLink) {
  if (document.querySelector(`${scrollLink}`)) {
    const links = document.querySelectorAll(scrollLink);
    for (const link of links) {
      link.addEventListener("click", clickHandler);
    }
    function clickHandler(e) {
      e.preventDefault();
      const theLink = this.getAttribute("href");
      document.querySelector(theLink).scrollIntoView(
        {
          behavior: "smooth",
        },
        1000
      );
    }
  }
}
export function svg(svgs) {
  if (document.querySelector(`${svgs}`)) {
    SVGInjector(document.querySelectorAll(`${svgs}`));
  }
}
export function loadMore(loadmorecontainer, loadmorebtn) {
  document.addEventListener("DOMContentLoaded", function () {
    loadmorecontainer = document.querySelector(`${loadmorecontainer}`);
    loadmorebtn = document.querySelector(`${loadmorebtn}`);
    const itemsPerLoad = 5;

    let totalItems = loadmorecontainer.children.length;
    let visibleItems = itemsPerLoad;
    function loadMoreItems() {
      for (
        let i = visibleItems;
        i < Math.min(totalItems, visibleItems + itemsPerLoad);
        i++
      ) {
        loadmorecontainer.children[i].style.display = "block";
      }
      visibleItems += itemsPerLoad;
      if (visibleItems >= totalItems) {
        loadmorebtn.style.display = "none";
      }
    }
    loadmorebtn.addEventListener("click", loadMoreItems);
    for (let i = visibleItems; i < totalItems; i++) {
      loadmorecontainer.children[i].style.display = "none";
    }
  });
}
