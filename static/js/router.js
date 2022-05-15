import {
    barButtonClicked
} from "./all.js";


function redirect_to(arg) {
    fetch("http://127.0.0.1:8000" + arg)
                .then((response) => response.text())
                .then((text) => {
                    const otherDoc = document.implementation.createHTMLDocument('title').documentElement;
                    otherDoc.innerHTML = text;
                    document.body.innerHTML = otherDoc.querySelector('#idBody').innerHTML

                    // let regroupButton = document.getElementById("idItemRegroup")
                    // // regroupButton = regroupButton.parentElement.parentElement.parentElement
                    // // const regroupButton = document.querySelector('#idItemRegroup')
                    // console.log(regroupButton)
                    // if (regroupButton !== null) {
                    //     regroupButton.style.backgroundColor = 'yellow'
                    //     regroupButton.addEventListener("click",e => console.log(e));
                    //
                    // }
                    // document.getElementById('idItemDelete')
                    //     .addEventListener("click",() => alert(2));

                    document.getElementById('idNavTransaction')
                        .addEventListener("click",() => router.loadRoute('/transactions/'));
                    document.getElementById('idNavCategories')
                        .addEventListener("click",() => router.loadRoute('/categories/'));
                    document.getElementById('idNavOverview')
                        .addEventListener("click",() => router.loadRoute('/overview/'));


                    console.log('in redirect_to()')
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

    history.pushState({}, '', url);
    redirect_to(url)
  }
}

const router = new Router(routes);
// document.getElementById('idNavTransaction')
//     .addEventListener("click",() => router.loadRoute('/transactions/'));
//
// document.getElementById('idNavCategories')
//     .addEventListener("click",() => router.loadRoute('/categories/'));
//
// document.getElementById('idNavOverview')
//     .addEventListener("click",() => router.loadRoute('/overview/'));

window.addEventListener('load', () => {
    const location = document.URL

    const route = `/${location.split('/').slice((3)).join('/')}`
    router.loadRoute(route)
})
