let visivilty = document.querySelector('.visivilty')
let password = document.querySelector('#password-input')

// password eye
let is_show = true
visivilty.addEventListener('click', () => {
  if (is_show) {
    password.setAttribute('type', 'text')
    visivilty.innerHTML = ' visibility'
  } else {
    password.setAttribute('type', 'password')
    visivilty.innerHTML = ' visibility_off'
  }
  is_show = !is_show
})
