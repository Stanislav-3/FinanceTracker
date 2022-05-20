function changeMenuState(checkbox) {
    const footer = document.querySelector('footer')
    const hamburgerQuery = window.matchMedia("(max-width: 500px)")
    const menu = document.getElementById("idMainMenu")
    const main = document.getElementById("idMainDiv")


    function enterMenuMode() {
        if (footer !== null) {
            footer.classList.add('rmv')
        }

        menu.classList.remove('main_menu')
        menu.classList.add('hamburgerMenu')

        main.classList.remove('main_div')
        main.classList.add('rmv')
    }

    function enterNormalMode() {
        if (footer !== null) {
            footer.classList.remove('rmv')
        }

        menu.classList.add('main_menu')
        menu.classList.remove('hamburgerMenu')

        main.classList.add('main_div')
        main.classList.remove('rmv')
    }

    if(checkbox.checked) {
        enterMenuMode()
    } else {
        enterNormalMode()
    }

    function listener(e) {
        if (!e.matches) {
            enterNormalMode()
            checkbox.checked = false
        }
    }

    hamburgerQuery.addListener(listener)
}