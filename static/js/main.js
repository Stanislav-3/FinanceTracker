import {
    router
} from "./router.js";

import {
    initialize,
    addOptionsToSelect
} from "./edit.js";

import {
    getCookie
} from "./cookie.js";


function styleButton(active, passive) {
    active.style.color = '#32cd32';
    passive.style.color = 'black';

    active.style.borderBottomColor = '#32cd32';
    active.style.borderBottomWidth = '3px';
    active.style.borderBottomStyle = 'solid';

    passive.style.borderBottomStyle = 'none';
}


export function barButtonClicked(button) {
    const expensesButton = document.getElementById('idExpensesButton')
    const incomeButton = document.getElementById('idIncomeButton')

    expensesButton.addEventListener("click",() => barButtonClicked('Expenses'));
    incomeButton.addEventListener("click",() => barButtonClicked('Income'));

    if (button === 'Expenses') {
        if (currentBarHolder === "Transactions") {
            window.transactionsBarButtonState = 'Expenses'
        }
        else if (currentBarHolder === "Categories") {
            window.categoriesBarButtonState = 'Expenses'
        }

        styleButton(expensesButton, incomeButton)

    } else if (button === 'Income') {
        if (currentBarHolder === "Transactions") {
            window.transactionsBarButtonState = 'Income'
        }
        else if (currentBarHolder === "Categories") {
            window.categoriesBarButtonState = 'Income'
        }

       styleButton(incomeButton, expensesButton)
    }

    if (!document.URL.includes('/edit')) {
        updateItems(window.currentBarHolder)
    } else if (window.currentBarHolder === 'Transactions') {
        addOptionsToSelect(document.getElementById('idCategory'))
    }
}


function fillItems(obj) {
    const itemsContainer = document.getElementById('idItems')
    const itemContainer = document.getElementById('idItem')
    const imgContainer = itemContainer.querySelector('#idItemImage')
    const nameContainer = itemContainer.querySelector('#idItemName')
    let priceContainer

    if (window.currentBarHolder === "Transactions") {
        priceContainer = itemContainer.querySelector('#idItemAmount')
    }

    itemsContainer.innerHTML = ""
    const items = obj['items']
    for (let i = 0; i < items.length; i++) {
        nameContainer.textContent = items[i]['name']
        imgContainer.src = window.serverUrl + '/' + items[i]['image_name']

        if (window.currentBarHolder === "Transactions" && priceContainer !== null) {
            priceContainer.textContent = items[i]['amount']
        }
        const newNode = itemContainer.cloneNode(true)

        newNode.querySelector('#idItemEdit')
            .addEventListener("click",() => {
                router.load_optional(newNode)
                router.loadRoute('/' + window.currentBarHolder.toLowerCase() + '/edit')
            })
        newNode.querySelector('#idItemDelete')
            .addEventListener("click",() => {
                deleteItem(newNode)
            })
        itemsContainer.append(newNode)
    }
}


function updateItems(currentBarHolder) {
    let url = undefined
    let buttonName = undefined
    let buttonState = undefined
    if (currentBarHolder === "Transactions") {
            url = window.serverUrl + '/transactions' + '/get_transactions_by_type'
            buttonState = window.transactionsBarButtonState
        }
    else if (currentBarHolder === "Categories") {
            url = window.serverUrl + '/categories' +'/get_categories_by_type'
            buttonState = window.categoriesBarButtonState
    }

    fetch(url, {
        method: 'post',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCookie("csrftoken")
        },
         body: JSON.stringify({
             "buttonName": buttonState
         })
        }).then(response => {
            response.json().then(
                obj => { fillItems(obj) }
            )
        })
}


function deleteItem(item) {
    const typeName = item.querySelector('#idItemName').innerText
    let amount = 0.
    let url = window.serverUrl + '/categories/delete_category'

    if (window.currentBarHolder === "Transactions") {
        amount = item.querySelector('#idItemAmount').innerText
        url = window.serverUrl + '/transactions/delete_transaction'
    }

    fetch(url, {
        method: 'post',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCookie("csrftoken")
        },
         body: JSON.stringify({
             "name": typeName,
             "amount": amount
         })
    }).then(response => {
        updateItems(window.currentBarHolder)
    })
}