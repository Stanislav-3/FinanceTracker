import {
    barButtonClicked
} from "./all.js";

// import {
//     categoriesBarButtonState,
//     transactionsBarButtonState,
//     currentBarHolder
// } from "./states.js";

function redirect_to(arg) {
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
                    } else if (arg.includes('categories')) {
                        window.currentBarHolder = 'Categories'
                        barButtonClicked(window.categoriesBarButtonState)
                    }

                    // const scripts = otherDoc.getElementsByTagName('script')
                    // for(let i = 0; i < scripts.length; i++)
                    // {
                    //     document.body.appendChild(scripts[i]);
                    // }
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
  }

  loadRoute(...urlSegments) {
    const url = `${urlSegments.join('/')}`;
    console.log('url', url)

    history.pushState({}, '', url);
    redirect_to(url)
  }
}

const router = new Router(routes);
document.getElementById('idNavTransaction')
    .addEventListener("click",() => router.loadRoute('/transactions/'));

document.getElementById('idNavCategories')
    .addEventListener("click",() => router.loadRoute('/categories/'));

document.getElementById('idNavOverview')
    .addEventListener("click",() => router.loadRoute('/overview/'));

window.addEventListener('load', () => {
    const location = document.URL
    console.log('location', location)

    const route = `/${location.split('/').slice((3)).join('/')}`
    router.loadRoute(route)
})