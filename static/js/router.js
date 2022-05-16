import {
    barButtonClicked
} from "./main.js";

import {
    saveChanges,
    initialize
} from "./edit.js"

import {
    getCookie
} from "./cookie.js";



function redirect_to(arg) {
    // console.log(arg)
    fetch("http://127.0.0.1:8000" + arg)
                .then((response) => response.text())
                .then((text) => {
                    const otherDoc = document.implementation.createHTMLDocument('title').documentElement;
                    otherDoc.innerHTML = text;
                    document.body.innerHTML = otherDoc.querySelector('#idBody').innerHTML

                    document.getElementById('idNavTransaction')
                        .addEventListener("click",() => router.loadRoute('/transactions/'));
                    document.getElementById('idNavCategories')
                        .addEventListener("click",() => router.loadRoute('/categories/'));
                    document.getElementById('idNavOverview')
                        .addEventListener("click",() => router.loadRoute('/overview/'));

                    if (arg.includes('transactions')) {
                        window.currentBarHolder = 'Transactions'
                        barButtonClicked(window.transactionsBarButtonState)

                        if (!arg.includes('edit')) {
                            document.getElementById('idFooterButton')
                                .addEventListener('click', () => {
                                    router.optional = undefined
                                    router.loadRoute('/categories/edit')
                            })
                        }
                    } else if (arg.includes('categories')) {
                        window.currentBarHolder = 'Categories'
                        barButtonClicked(window.categoriesBarButtonState)

                        if (!arg.includes('edit')) {
                            document.getElementById('idFooterButton')
                                .addEventListener('click', () => {
                                    router.optional = undefined
                                    router.loadRoute('/categories/edit')
                            })
                        }
                    }
                    if (arg.includes('edit')) {
                        initialize(router.optional)
                    }
            });
}

const routes = [
    '/categories',
  '/transactions',
  '/overview'
];

class Router {
  constructor(routes) {
    this.routes = routes;
    this.optional = undefined
  }

  load_optional(data) {
      this.optional = data
  }

  loadRoute(...urlSegments) {
      const url = `${urlSegments.join('/')}`;
      console.log('url', url)

      history.pushState({}, '', url);
      redirect_to(url)
  }
}

export const router = new Router(routes);


window.addEventListener('load', () => {
    const location = document.URL

    const route = `/${location.split('/').slice((3)).join('/')}`
    router.loadRoute(route)
})
