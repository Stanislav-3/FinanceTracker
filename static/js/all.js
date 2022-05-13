

function check() {
    main = document.getElementById('idMain')
    transactions = document.getElementById('idTransactionsMain')

    window.location = 'http://127.0.0.1:8000/transactions/'

    h = document.getElementById('idHeader')
    // main.textContent = transactions.textContent
    window.alert(h)
}
