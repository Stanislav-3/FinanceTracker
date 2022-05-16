const hamburgerQuery = window.matchMedia("(max-width: 500px)")
const toggle = document.getElementById('toggle')

function listener(e) {
  if (e.matches) {
    console.log('Media Query Matched!')
  } else {
    console.log('Media Query not Matched!')
  }
}

hamburgerQuery.addListener(listener)

console.log(toggle)

// let checkbox = document.querySelector("input[type=checkbox]");
// console.log('strcheckbox', checkbox)

// toggle.addEventListener('click', e => {
//     console.log('_changed')
//     if (e.checked) {
//         console.log('checked')
//     } else {
//         console.log('not checked')
//     }
// })


// const icon = document.getElementById('idToggledIcon')
// icon.addEventListener('click', () => {
//     console.log('yeah')
//
// })
