'use strict'

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const loginForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')
const cardRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')

let login = localStorage.getItem('gloDelivery');

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open')
}

function authorized() {
  function logOut() {
    login = null
    localStorage.removeItem('gloDelivery')
    buttonAuth.style.display = ''
    userName.style.display = ''
    buttonOut.style.display = ''
    buttonOut.removeEventListener('click', logOut)
    
    checkAuth()
  }

  console.log('Авторизован');
  userName.textContent = login
  buttonAuth.style.display = 'none'
  userName.style.display = 'inline'
  buttonOut.style.display = 'block'
  buttonOut.addEventListener('click', logOut)
}
function maskInput(string) {
  return !!string.trim()
}

function notAuthorized() {
  console.log('Не авторизован');
  
  function logIn(e) {
    e.preventDefault()
    if(maskInput(loginInput.value)) {
      login = loginInput.value
      localStorage.setItem('gloDelivery', login)
    toggleModalAuth()
    buttonAuth.removeEventListener('click', toggleModalAuth)
    closeAuth.removeEventListener('click', toggleModalAuth)
    logInForm.removeEventListener('submit', logIn)
    logInForm.reset()
    checkAuth()
    } else {
      loginInput.style.borderColor = 'red'
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth)
  closeAuth.addEventListener('click', toggleModalAuth)
  logInForm.addEventListener('submit', logIn)
  
}

function checkAuth() {
  if(login) {
    authorized()
  } else {
  notAuthorized()
  }
}
checkAuth()

function createCardRestaurant() {//берем из верстки карточку пока не динамически
  const card = `<a class="card card-restaurant">
                  <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title">Пицца плюс</h3>
                      <span class="card-tag tag">50 мин</span>
                    </div>
                    <div class="card-info">
                      <div class="rating">
                        4.5
                      </div>
                      <div class="price">От 900 ₽</div>
                      <div class="category">Пицца</div>
                    </div>
                  </div>
                </a>`
                cardRestaurants.insertAdjacentHTML('afterbegin', card)
}

createCardRestaurant()

function createCardGood() {
  const card = document.createElement('div')
  console.log(card);
  card.className = 'card'
  card.insertAdjacentHTML('beforeend',`
                      <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
                      <div class="card-text">
                        <div class="card-heading">
                          <h3 class="card-title card-title-reg">Пицца Классика</h3>
                        </div>
                        <div class="card-info">
                          <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
                                                  грибы.
                          </div>
                        </div>
                        <div class="card-buttons">
                          <button class="button button-primary button-add-cart">
                            <span class="button-card-text">В корзину</span>
                            <span class="button-cart-svg"></span>
                          </button>
                          <strong class="card-price-bold">510 ₽</strong>
                        </div>
                      </div>
                    `)
                    cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(e) {
  if(login) {
    authorized()
    const target = e.target
  const restaurant = target.closest('.card-restaurant')//вся карточка
  if(restaurant) {
    cardsMenu.textContent = ''//очищаем, чтоб не дублировались при повторном входе
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')

    createCardGood()
    createCardGood()
    createCardGood()
  }
  } else {//если не авторизованы - вызываем модальное окно
    toggleModalAuth()
  }
}

close.addEventListener("click", toggleModal);// закрытие окна авторизации
cartButton.addEventListener("click", toggleModal);//переключение
cardRestaurants.addEventListener('click', openGoods)//переход в конкретный ресторан
logo.addEventListener('click', function() {//возврат к списку ресторанов
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
})

