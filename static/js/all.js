function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export let categoriesBarButtonState = 'Expenses'
export let transactionsBarButtonState = 'Expenses'

export function barButtonClicked(button) {
    const expensesButton = document.getElementById('idExpensesButton')
    const incomeButton = document.getElementById('idIncomeButton')

    expensesButton.addEventListener("click",() => barButtonClicked('Expenses'));
    incomeButton.addEventListener("click",() => barButtonClicked('Income'));

    if (button === 'Expenses') {
        if (document.URL.includes('transactions')) {
            transactionsBarButtonState = 'Expenses'
            console.log('transactions')
        }
        else if (document.URL.includes('categories')) {
            categoriesBarButtonState = 'Expenses'
            console.log('categories')
        }

        expensesButton.style.color = '#32cd32';
        incomeButton.style.color = 'black';

        expensesButton.style.borderBottomColor = '#32cd32';
        expensesButton.style.borderBottomWidth = '3px';
        expensesButton.style.borderBottomStyle = 'solid';

        incomeButton.style.borderBottomStyle = 'none';
    } else if (button === 'Income') {
        if (document.URL.includes('transactions')) {
            transactionsBarButtonState = 'Income'
            console.log('transactions')
        }
        else if (document.URL.includes('categories')) {
            categoriesBarButtonState = 'Income'
            console.log('categories')
        }

        expensesButton.style.color='black';
        incomeButton.style.color='#32cd32';

        incomeButton.style.borderBottomColor = '#32cd32';
        incomeButton.style.borderBottomWidth = '3px';
        incomeButton.style.borderBottomStyle = 'solid';

        expensesButton.style.borderBottomStyle = 'none';
    }

    updateItems()
}



function updateItems(url, buttonName, buttonState) {
    fetch('get_categories_by_type', {
        method: 'post',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCookie("csrftoken")
        },
         body: JSON.stringify({
             'categoriesBarButtonState': categoriesBarButtonState
         })
        }).then(response => {
            response.json().then(
                obj => {
                    const items = obj['items']
                    const itemsContainer = document.getElementById('idItems')
                    const itemContainer = document.getElementById('idItem')
                    const imgContainer = itemContainer.querySelector('#idItemImage')
                    const pContainer = itemContainer.querySelector('#idItemName')

                    itemsContainer.innerHTML = ""
                    for (let i = 0; i < items.length; i++) {
                        pContainer.textContent = items[i]['name']
                        imgContainer.src = items[i]['image_name']
                        itemsContainer.append(itemContainer.cloneNode(true))
                    }
                }
            )
        })
}

barButtonClicked(categoriesBarButtonState)
