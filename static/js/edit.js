import {
    router
} from "./router.js";

import {
    getCookie
} from "./cookie.js";

export function initialize(currentParentUrl, node) {
    if (node === undefined) {
        document.getElementById('idFooterButton')
            .addEventListener("click",() =>
                saveChanges(`/${currentParentUrl}`, ''));
        return
    }
    const title = document.getElementById("idMainTitle")
    const submitButton = document.getElementById('idFooterButton')

    const type = window.currentBarHolder.toLowerCase()

    let props = {}

    title.innerText = `Edit ${type}`
    const icon = submitButton.getElementsByTagName('svg')[0]

    submitButton.innerHTML=''
    submitButton.appendChild(icon)
    submitButton.append(` Save ${type}`)

    if (type === 'transactions') {
        const amountInput = document.getElementById('idAmount')
        const categorySelect = document.getElementById('idCategory')
        const dateInput = document.getElementById('idDate')
        const informationInput = document.getElementById('idInformation')

        const category = node.querySelector('#idItemName').innerText
        const amount = node.querySelector('#idAmount').innerText
        // const image = node.querySelector('#idItemImage')

        categorySelect.value = category
        amountInput.innerText = amount

        props = {
            'prevAmount': node.querySelector('#idItemAmount').innerText,
            'prevLabel': node.querySelector('#idItemName').innerText
        }
    } else if (type === 'categories') {
        const itemName = node.querySelector('#idItemName')

        const nameField = document.getElementById('idName')
        nameField.value = itemName.innerText

        props = {'itemNameText' : itemName.innerText}
    }

    document.getElementById('idFooterButton')
        .addEventListener("click",() => saveChanges(`/${currentParentUrl}`, props));
}

export function saveChanges(parentRootUrl = '', props =null) {
    let url = "http://127.0.0.1:8000" + parentRootUrl + '/save_edit'

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
        const prevItemName = props['prevItemName']
        const reader = new FileReader()
        const name = document.getElementById('idName').value
        let image = null

        reader.addEventListener("load", () => {
            image = reader.result

            const props = {
                "prevItemName": prevItemName,
                "name": name,
                "image": image,
                "type": window.categoriesBarButtonState
            }
            post_data(url, props)
        })
        reader.readAsDataURL(document.getElementById('idImage').files[0])

    } else if (window.currentBarHolder === 'Transactions') {
        const props = {
            'prevAmount': props['prevAmount'],
            'prevLabel': props['prevLabel'],
            'amount': document.getElementById('idAmount').value,
            'label': document.getElementById('idCategory').value,
            'date': document.getElementById('idDate').value,
            'information': document.getElementById('idInformation').value,
        }

        post_data(url, props)
    }
}