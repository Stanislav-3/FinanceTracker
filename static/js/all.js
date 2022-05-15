import {
    router
} from "./router.js";


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
        }
        else if (currentBarHolder === "Categories") {
            window.categoriesBarButtonState = 'Expenses'
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

    if (!document.URL.includes('/edit')) {
        updateItems(window.currentBarHolder)
    }
}


function updateItems(currentBarHolder) {
    let url = undefined
    let buttonName = undefined
    let buttonState = undefined
    if (currentBarHolder === "Transactions") {
            url = "http://127.0.0.1:8000" + '/transactions' + '/get_transactions_by_type'
            buttonState = window.transactionsBarButtonState
        }
    else if (currentBarHolder === "Categories") {
            url = "http://127.0.0.1:8000" + '/categories' +'/get_categories_by_type'
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
                    if (window.currentBarHolder === "Transactions") {
                        priceContainer = itemContainer.querySelector('#idItemAmount')
                    }
                    itemsContainer.innerHTML = ""
                    for (let i = 0; i < items.length; i++) {
                        nameContainer.textContent = items[i]['name']
                        // imgContainer.src = items[i]['image_name']
                        imgContainer.src = '../static/images/work.jpg'
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
                        if (window.currentBarHolder === "Categories") {
                            newNode.querySelector('#idItemRegroup')
                                .addEventListener("click",() => {})
                        }

                        itemsContainer.append(newNode)
                    }
                }
            )
        })
}


function deleteItem(item) {
    const typeName = item.querySelector('#idItemName').innerText
    let amount = 0.
    let url = 'delete_category'

    if (window.currentBarHolder === "Transactions") {
        amount = item.querySelector('#idItemAmount').innerText
        url = 'delete_transaction'
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

export function initialize(node) {
    const title = document.getElementById("idMainTitle")
    const submitButton = document.getElementById('idFooterButton')

    const type = window.currentBarHolder.toLowerCase()

    let itemNameText = ''

    title.innerText = `Edit ${type}`
    const icon = submitButton.getElementsByTagName('svg')[0]

    submitButton.innerHTML=''
    submitButton.appendChild(icon)
    submitButton.append(` Save ${type}`)

    if (type === 'transactions') {

    } else if (type === 'categories') {
        const itemName = node.querySelector('#idItemName')

        const nameField = document.getElementById('idName')
        nameField.value = itemName.innerText
        itemNameText = itemName.innerText
    }

    document.getElementById('idFooterButton')
        .addEventListener("click",() => saveChanges(itemNameText));
}

export function saveChanges(prevItemName=null) {
    let parentRoot = '/categories'
    let url = "http://127.0.0.1:8000" + parentRoot + '/save_edit'
    const name = document.getElementById('idName').value
    let image = null


    const reader = new FileReader()
    reader.addEventListener("load", () => {
        image = reader.result

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
             "prevItemName": prevItemName,
             "name": name,
             "image": image,
             "type": window.categoriesBarButtonState
         })
        }).then(response => {
            response.json().then( () => {
                router.loadRoute(parentRoot)
            })
        })
    })
    reader.readAsDataURL(document.getElementById('idImage').files[0])
}