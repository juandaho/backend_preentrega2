
function addToCart(product) {
    console.log(`Producto agregado: ${product}`);
    console.log('Producto agregado al carrito');
}

function clearCart() {
    shoppingCart = [];
    console.log('Carrito de compras vaciado');
}

function updateProductList(products) {
   
    let div = document.getElementById("list-products");
    let productos = "";

    products.forEach((product) => {
  
        productos += `
            <article class="container">
                <div class="card">
                    <div class="imgBx">
                        <img src="${product.thumbnail}" width="150" />
                    </div>
                    <div class="contentBx">
                        <h2>${product.title}</h2>
                        <div class="size">
                            <h3>${product.description}</h3>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>10</span>
                        </div>
                        <div class="color">
                            <h3>${product.price}</h3>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <a href="#">Buy Now</a>
                    </div>
                </div>
            </article>`;
    });

   
    div.innerHTML = productos;
}

