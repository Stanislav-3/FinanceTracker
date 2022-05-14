// import {
//     categoriesBarButtonState,
//     transactionsBarButtonState,
//     currentBarHolder
// } from "./states.js";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function barButtonClicked(button) {
    const expensesButton = document.getElementById('idExpensesButton')
    const incomeButton = document.getElementById('idIncomeButton')

    expensesButton.addEventListener("click",() => barButtonClicked('Expenses'));
    incomeButton.addEventListener("click",() => barButtonClicked('Income'));

    if (button === 'Expenses') {
        if (currentBarHolder === "Transactions") {
            window.transactionsBarButtonState = 'Expenses'
            console.log('transactions')
        }
        else if (currentBarHolder === "Categories") {
            window.categoriesBarButtonState = 'Expenses'
            console.log('categories')
        }

        expensesButton.style.color = '#32cd32';
        incomeButton.style.color = 'black';

        expensesButton.style.borderBottomColor = '#32cd32';
        expensesButton.style.borderBottomWidth = '3px';
        expensesButton.style.borderBottomStyle = 'solid';

        incomeButton.style.borderBottomStyle = 'none';
    } else if (button === 'Income') {
        if (currentBarHolder === "Transactions") {
            window.transactionsBarButtonState = 'Income'
            console.log('transactions')
        }
        else if (currentBarHolder === "Categories") {
            window.categoriesBarButtonState = 'Income'
            console.log('categories')
        }

        expensesButton.style.color='black';
        incomeButton.style.color='#32cd32';

        incomeButton.style.borderBottomColor = '#32cd32';
        incomeButton.style.borderBottomWidth = '3px';
        incomeButton.style.borderBottomStyle = 'solid';

        expensesButton.style.borderBottomStyle = 'none';
    }

    updateItems(window.currentBarHolder)
}


function updateItems(currentBarHolder) {
    let url = undefined
    let buttonName = undefined
    let buttonState = undefined
    if (currentBarHolder === "Transactions") {
            url = 'get_transactions_by_type'
            buttonState = window.transactionsBarButtonState
        }
    else if (currentBarHolder === "Categories") {
            url = 'get_categories_by_type'
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
                obj => {
                    const items = obj['items']
                    const itemsContainer = document.getElementById('idItems')
                    const itemContainer = document.getElementById('idItem')
                    const imgContainer = itemContainer.querySelector('#idItemImage')
                    const nameContainer = itemContainer.querySelector('#idItemName')
                    let priceContainer = undefined
                    if (window.currentBarHolder == "Transactions") {
                        priceContainer = itemContainer.querySelector('#idItemPrice')
                    }

                    itemsContainer.innerHTML = ""
                    for (let i = 0; i < items.length; i++) {
                        nameContainer.textContent = items[i]['name']
                        imgContainer.src = items[i]['image_name']
                        if (priceContainer !== undefined) {
                            priceContainer.textContent = items[i]['amount']
                        }
                        itemsContainer.append(itemContainer.cloneNode(true))
                    }
                }
            )
        })
}

if (window.currentBarHolder === "Transactions") {
    barButtonClicked(transactionsBarButtonState)
}
else if (window.currentBarHolder === "Categories") {
    barButtonClicked(categoriesBarButtonState)
}