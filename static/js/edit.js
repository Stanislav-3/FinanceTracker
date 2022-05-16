import {
    router
} from "./router.js";

import {
    getCookie
} from "./cookie.js";


export function addOptionsToSelect(selectElement, category=null) {
    const url = "http://127.0.0.1:8000" + "/transactions" + "/edit/get_select_options"
    const props = {
        'type': window.transactionsBarButtonState
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
             body: JSON.stringify(props)
            }).then(response => {
                response.json().then((obj) => {
                    while (selectElement.length > 0) {
                        selectElement.remove(0);
                    }
                    const elements = obj['items']
                    for (let i = 0; i < elements.length; i++) {
                        selectElement.add(new Option(elements[i], elements[i]));
                    }

                    if (category) {
                        selectElement.value = category
                        selectElement.selectedIndex = elements.indexOf(category)
                    }
                })
            })
}

function initializeDateAndInformationInputs(category, amount, dateInput, informationInput) {
    const url = "http://127.0.0.1:8000" + "/transactions" + "/edit/get_inputs_data"
    const props = {
        'category': category,
        'amount': amount
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
             body: JSON.stringify(props)
            }).then(response => {
                response.json().then((obj) => {
                    const props = obj['items']
                    dateInput.value = props['date']
                    informationInput.value = props['information']
                })
            })
}


export function initialize(node) {
    const type = window.currentBarHolder.toLowerCase()
    const currentParentUrl = `/${type}`

    // if adding new element
    if (node === undefined) {
        document.getElementById('idFooterButton')
            .addEventListener("click",() =>
                saveChanges(currentParentUrl, {}));

        if (type === 'transactions') {
            addOptionsToSelect(document.getElementById('idCategory'))
        }
        return
    }

    // if editing an existing element
    document.getElementById("idMainTitle").innerText = `Edit ${type}`

    const footerButton = document.getElementById('idFooterButton')
    const icon = footerButton.getElementsByTagName('svg')[0]

    footerButton.innerHTML = ''
    footerButton.appendChild(icon)
    footerButton.append(` Save ${type}`)

    let props = {}
    console.log('initialize', type)
    if (type === 'transactions') {
        const amountInput = document.getElementById('idAmount')
        const categorySelect = document.getElementById('idCategory')
        const dateInput = document.getElementById('idDate')
        const informationInput = document.getElementById('idInformation')

        const category = node.querySelector('#idItemName').innerText
        const amount = node.querySelector('#idItemAmount').innerText

        amountInput.value = amount
        addOptionsToSelect(categorySelect, category)

        props = {
            'prevAmount': node.querySelector('#idItemAmount').innerText,
            'prevLabel': node.querySelector('#idItemName').innerText
        }
    } else if (type === 'categories') {
        const itemName = node.querySelector('#idItemName')

        const nameField = document.getElementById('idName')
        nameField.value = itemName.innerText

        props = {'prevItemName' : itemName.innerText}
    }

    console.log('props in initialize', props)
    document.getElementById('idFooterButton')
        .addEventListener("click",() => {
            // if (window.currentBarHolder === "Transactions") {
            //     const amount = document.getElementById('idAmount').value
            //     if (window.transactionsBarButtonState === 'Expenses') {
            //         if (amount >= 0) {
            //             alert('Warning! Expenses amount should be < 0')
            //         }
            //     } else {
            //         if (amount <= 0) {
            //             alert('Warning! Income amount should be > 0')
            //         }
            //     }
            // }
            saveChanges(currentParentUrl, props)
        });
}


export function saveChanges(parentRootUrl = '', props) {
    let url = "http://127.0.0.1:8000" + parentRootUrl + '/save_edit'
    console.log('props in saveChanges', props)
    function post_data(url, props) {
        fetch(url, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                "X-CSRFToken": getCookie("csrftoken")
            },
             body: JSON.stringify(props)
            }).then(response => {
                response.json().then( () => {
                    router.loadRoute(parentRootUrl)
                })
            })
    }

    if (window.currentBarHolder === 'Categories') {
        let prevItemName = props['prevItemName']
        if (prevItemName === undefined) {
            prevItemName = null
        }

        const reader = new FileReader()
        const name = document.getElementById('idName').value
        let image = null

        reader.addEventListener("load", () => {
            image = reader.result

            const _props = {
                "prevItemName": prevItemName,
                "name": name,
                "image": image,
                "type": window.categoriesBarButtonState
            }
            post_data(url, _props)
        })
        reader.readAsDataURL(document.getElementById('idImage').files[0])

    } else {
        let prevAmount = props.prevAmount
        let prevLabel = props.prevLabel
        if (prevAmount === undefined) {
            prevAmount = null
        }
        if (prevLabel === undefined) {
            prevLabel = null
        }
        const props_ = {
            'prevAmount': prevAmount,
            'prevLabel': prevLabel,
            'amount': document.getElementById('idAmount').value,
            'label': document.getElementById('idCategory').value,
            'type': window.transactionsBarButtonState,
            'date': document.getElementById('idDate').value,
            'information': document.getElementById('idInformation').value,
        }

        post_data(url, props_)
    }
}