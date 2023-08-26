import fs from "fs"

export default class CartManager{
    constructor(path){
        this.path=path
    }

    getCarts = async () => {
        try {
            if(fs.existsSync(this.path)){
                const cartlist = await fs.promises.readFile(this.path,"utf-8")
                const cartlistparse = JSON.parse(cartlist)
                return cartlistparse
            } else {
                return []
            }
        } catch(error) {
            throw new Error(`Error getting carts: ${error.message}`)
        }
    }

    getCartbyId = async(id) => {
        const { cid } = id
        const allcarts = await this.getCarts()
        const found = allcarts.find(element => element.id === parseInt(cid))
        if (!found) {
            throw new Error("Cart not found") // Change here
        }
        return found
    }

    // GENERATE ID 
    generateCartId = async () => {
        if (fs.existsSync(this.path)) {
            const listadecarts = await this.getCarts()
            return listadecarts.length ? listadecarts[listadecarts.length-1].id + 1 : 1
        }
    }

    // CREATE
    addCart = async () => {
        const listadecarts = await this.getCarts()
        const id = await this.generateCartId()
        const cartnew = {
            id,
            products: []
        }
        listadecarts.push(cartnew)
        await fs.promises.writeFile(this.path, JSON.stringify(listadecarts, null, 2))
    }

    // UPDATE
    addProductToCart = async (cid, pid) => {
        const listaCarts = await this.getCarts()

        const cart = listaCarts.find(e => e.id === cid)
        
        if (!cart) {
            throw new Error(`Cart with id ${cid} not found`)
        }

        const productIndex = cart.products.findIndex(element => element.pid === pid)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++
        } else {
            cart.products.push({
                pid,
                quantity: 1
            })
        }
        
        await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2))
    }
}
