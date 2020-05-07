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

const getData = async function(url) {
  const response = await fetch(url)
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  return await response.json()
  
}

getData('./db/partners.json')

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/
  return nameReg.test(str)
}
valid()

const toggleModal = () => {
  modal.classList.toggle("is-open");
}

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open')
}

function returnMain() {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
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
    returnMain()
  }

  userName.textContent = login
  buttonAuth.style.display = 'none'
  userName.style.display = 'inline'
  buttonOut.style.display = 'block'
  buttonOut.addEventListener('click', logOut)
}

function notAuthorized() {
  
  function logIn(e) {
    e.preventDefault()
    if(valid(loginInput.value)) {
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
      loginInput.value = ''
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

function createCardRestaurant(restaurant) {//карточка ресторана
  
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant
  const card = `<a class="card card-restaurant" data-products="${products}">
                  <img src="${image}" alt="image" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title">${name}</h3>
                      <span class="card-tag tag">${timeOfDelivery} мин</span>
                    </div>
                    <div class="card-info">
                      <div class="rating">
                        ${stars}
                      </div>
                      <div class="price">От ${price} ₽</div>
                      <div class="category">${kitchen}</div>
                    </div>
                  </div>
                </a>`
                cardRestaurants.insertAdjacentHTML('afterbegin', card)
}


function createCardGood(goods) {//Карточки товаров конкретного ресторана
  const { description, image, name, price } = goods
  const card = document.createElement('div')
  
  card.className = 'card'
  card.insertAdjacentHTML('beforeend',`
                      <img src="${image}" alt="image" class="card-image"/>
                      <div class="card-text">
                        <div class="card-heading">
                          <h3 class="card-title card-title-reg">${name}</h3>
                        </div>
                        <div class="card-info">
                          <div class="ingredients">${description}
                          </div>
                        </div>
                        <div class="card-buttons">
                          <button class="button button-primary button-add-cart">
                            <span class="button-card-text">В корзину</span>
                            <span class="button-cart-svg"></span>
                          </button>
                          <strong class="card-price-bold">${price} ₽</strong>
                        </div>
                      </div>
                    `)
                    cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(e) {
  
  const target = e.target
  if(login) {
    const restaurant = target.closest('.card-restaurant')//вся карточка
    if(restaurant) {
      console.log(restaurant);
      getData('./db/partners.json').then(data => {
        let  matched = data.find(rest => rest.products === restaurant.dataset.products);
        
        const headerSection = menu.querySelector('.section-heading');
        console.log(menu);
        
        
        console.log(headerSection);

        headerSection.innerHTML = `
          <h2 class="section-title restaurant-title">${matched.name}</h2>
          <div class="card-info">
            <div class="rating">
              ${matched.stars}
            </div>
            <div class="price">От ${matched.price} ₽</div>
            <div class="category">${matched.kitchen}</div>
          </div>`;

      });

      cardsMenu.textContent = ''//очищаем, чтоб не дублировались при повторном входе
      
      containerPromo.classList.add('hide')
      restaurants.classList.add('hide')
      menu.classList.remove('hide')
      
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood)
      });
    }
    else {//если не авторизованы - вызываем модальное окно
      toggleModalAuth()
      //returnMain()
    }
  } 
}



function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant)
   });

   
   
   close.addEventListener("click", toggleModal);// закрытие окна авторизации
   cartButton.addEventListener("click", toggleModal);//переключение
   cardRestaurants.addEventListener('click', openGoods)//переход в конкретный ресторан
   logo.addEventListener('click', function() {//возврат к списку ресторанов
     containerPromo.classList.remove('hide')
     restaurants.classList.remove('hide')
     menu.classList.add('hide')
   })
   
   
   new Swiper('.swiper-container', {
     loop: true,
     autoplay: true,
     slidesPerView: 1
   })
}

init()
