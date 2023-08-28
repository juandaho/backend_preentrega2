
let cartDiv = document.getElementById("cartDiv");
let productsDiv = document.getElementById("productsDiv");

let cartId = "";

const newCart = async () => {
    try {
        if (!cartId) {
            const resp = await fetch(`http://localhost:8080/api/carts/`, {
                method: "POST",
            });
            const result = await resp.json();
            console.log("resultado", result);
            cartId = result.data._id;
           

            cartDiv.innerHTML = cartId;

            const cartLink =document.getElementById ("cartLink");
            cartLink.href = `http://localhost:8080/api/carts/${cartId}`;
        } else {
            console.log("Se esta usando un carrito");
        }
    } catch (error) {
        console.log("Error: ", error.message);
    }
};

const addToCart = async (productId) => {
    try {
        if (productId && cartId) {
            const resp = await fetch(
                `http://localhost:8080/api/carts/${cartId}/product/${productId}`,
                {
                    method: "POST",
                }
            );
            const result = await resp.json();
            console.log("resultado", result);

            if (result.status == "success") {
                const payload = await fetch(
                    `http://localhost:8080/api/carts/${cartId}`,
                    {
                        method: "GET",
                    }
                );
      
                console.log(payload);
            }
        }
    } catch (error) {
        console.log("Error: Al contabilizar el carrito", error.message);
    }
};


