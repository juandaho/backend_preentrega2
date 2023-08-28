
const socketClient = io();


socketClient.on("enviodeproducts", updateProductList);


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


let form = document.getElementById("formProduct");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    
    let formData = new FormData(form);

    let productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        stock: formData.get("stock"),
        thumbnail: formData.get("thumbnail"),
        category: formData.get("category"),
        price: formData.get("price"),
        code: formData.get("code")
    };

    
    socketClient.emit("addProduct", productData);

 
    form.reset();
});


document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value;

    
    console.log(`Intentando eliminar producto con ID: ${deleteid}`);

    if (deleteid) {
        socketClient.emit("deleteProduct", deleteid);
    } else {
      
        console.log("ID del producto no proporcionado");
    }

    deleteidinput.value = "";
});


socketClient.on('connect_error', (err) => {
    console.log(`Error de conexión: ${err.message}`);
});
