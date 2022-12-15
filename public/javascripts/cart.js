let cartdiv = document.querySelector('.cart-div')
let carticon = document.querySelector('.cart-icon')
let xmark = document.querySelector('.xmark')
let blockbtn = document.querySelectorAll('.block')
let unblockbtn = document.querySelectorAll('.unblock')

console.log()
// unblockbtn.className = 'btn-sucess'


cartdiv.classList.add('dispaly-none')
carticon.addEventListener('click', () => {
  cartdiv.classList.toggle('dispaly-none')
})

xmark.addEventListener('click', () => {
  cartdiv.classList.toggle('dispaly-none')
})
