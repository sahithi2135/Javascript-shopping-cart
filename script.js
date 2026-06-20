let categoryBtnsContainer = document.getElementById("category_btns");
let productsContainer = document.getElementById("products_container");
let searchInput = document.getElementById("search_input");
let allProducts = []
let fetchData = async () => {
   let api = await fetch("https://dummyjson.com/products?limit=194")
   let response = await api.json()
   let finalData = response.products
   allProducts = finalData
   let allCategory = [...new Set(finalData.map((product)=>product.category))]
   allCategory.forEach((category)=>{
      categoryBtnsContainer.innerHTML +=`
      <button>${category}</button>`
   })
   displayingProducts(finalData)
   let allCategoryBtns = document.querySelectorAll("#category_btns>button")
   allCategoryBtns.forEach((button) => {
    button.addEventListener("click", () => {
        allCategoryBtns.forEach((btn) => {
            btn.classList.remove("active")
        })
        button.classList.add("active")
        let clickedCategory = button.innerHTML
        if (clickedCategory === "All"){
            displayingProducts(allProducts)
        } else {
            let filteredProducts = allProducts.filter((product) => { 
                return product.category === clickedCategory        
            })
            displayingProducts(filteredProducts)
        }
    })
   })
}

function displayingProducts(finalData) {
    productsContainer.innerHTML="" 
  finalData.forEach((product)=>{
    productsContainer.innerHTML += `
    <div class="card">
            <article class="products_img_container">
                <p class="discount">-${product.discountPercentage}%</p>
                <p class="ratings"><i class="fa-solid fa-star"></i>${product.rating}</p>
                <img src=${product.images[0]} alt=${product.title}>
            </article>
            <p class="category">${product.category}</p>
            <h2 class="title">${product.title}</h2>
            <aside>
                <div>
                    <p class="product_price">$${(product.price - product.price * (product.discountPercentage/100)).toFixed(2)} <del>$${product.price}</del></p>
                    <p>${product.availabilityStatus}</p>
                </div>
                <div>
                <p class="product_cart" data-id=${product.id} onclick=addToCart(${product.id})>
                    <i class="fa-solid fa-cart-shopping"></i>
                </p>
                </div>
            </aside>
        </div>`
  })
}

searchInput.addEventListener("input", () => {
    let searchValue = searchInput.value.toLowerCase()
    let filteredProducts = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchValue) || product.category.toLowerCase().includes(searchValue)
    })
    displayingProducts(filteredProducts)
})

function addToCart(id) {
    let clickedProduct = allProducts.find(product => product.id === id)
    let cartItems = JSON.parse(localStorage.getItem("cart")) || []
    let existingProduct = cartItems.find((product) => {
        return product.id === id
    })
    if (existingProduct) {
        clickedProduct.qty=existingProduct.qty++
    } else {
        let productObj = {
            id: clickedProduct.id,
            title: clickedProduct.title,
            img: clickedProduct.images[0],
            qty: 1,
            price: Number((clickedProduct.price - (clickedProduct.price * (clickedProduct.discountPercentage/100))).toFixed(2))
        }
        cartItems.push(productObj)
    }
    localStorage.setItem("cart",JSON.stringify(cartItems))
    updateCart()
    let clickedBtn = document.querySelector(`.product_cart[data-id='${id}']`)
    clickedBtn.classList.add("added")
    clickedBtn.innerHTML = '<i class="fa-solid fa-check" style=font-size:1.2rem></i>'
    alert(`${clickedProduct.title} added to cart`)
    setTimeout(()=>{
        clickedBtn.classList.remove("added")
        clickedBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>'
    }, 2000)
}

function updateCart(){
    let cartQuantity = document.getElementById("cart_quantity")
    let totalQty = 0
    let cartItems = JSON.parse(localStorage.getItem("cart")) || []
    cartItems.forEach((product) => {
        totalQty += product.qty
    })
    cartQuantity.innerHTML = totalQty
}

fetchData()
updateCart()

let cart = document.getElementById("nav_three")
cart.addEventListener("click",()=>{
    location.href = "cart.html"
})