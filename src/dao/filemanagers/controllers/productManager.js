import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async (info) => {
    const { limit = 10 } = info; // Establecer un valor predeterminado si limit no está definido
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistparse = JSON.parse(productlist);
        const productlistsliced = limit ? productlistparse.slice(0, limit) : productlistparse; // Usar el límite solo si está definido
        return productlistsliced;
      } else {
        throw new Error("Error listing products");
      }
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  };

    getProductbyId = async (id) => {
        const { pid } = id
        const allproducts = await this.getProducts({})
        const found = allproducts.find(element => element.id === parseInt(pid))
        if (!found) {
            throw new Error("Product not found") // Change here
        }
        return found
    }

    // GENERATE ID 
    generateId = async () => {
        if (fs.existsSync(this.path)) {
            const listaproducts = await this.getProducts({})
            return listaproducts.length ? listaproducts[listaproducts.length-1].id + 1 : 1
        }
    }

    // CREATE
    addProduct = async (obj) => {
        if(!this.validateProduct(obj)){
            throw new Error("Please enter all product data") // Change here
        }

        const listaproducts = await this.getProducts({})
        const codigorepetido = listaproducts.find(elemento => elemento.code === obj.code)
        if(codigorepetido){
            throw new Error("The product code you want to add is repeated") // Change here
        }

        const id = await this.generateId()
        const productnew = {
            id,
            ...obj
        }
        listaproducts.push(productnew)
        await fs.promises.writeFile(this.path, JSON.stringify(listaproducts, null, 2))
    }

    // UPDATE
    updateProduct = async (id, obj) => {
        if(!this.validateProduct(obj)){
            throw new Error("Please enter all product data for update") // Change here
        }

        const allproducts = await this.getProducts({})
        const codigorepetido = allproducts.find(elemento => elemento.code === obj.code)
        if(codigorepetido){
            throw new Error("The product code you want to update is repeated") // Change here
        }

        const newProductsList = allproducts.map(elemento => {
            if(elemento.id === parseInt(id.pid)){
                return {
                    ...elemento,
                    ...obj
                }
            } else {
                return elemento
            }
        })
        await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, 2))
    }

    // DELETE
    deleteProduct = async (pid) => {
        const allproducts = await this.getProducts({})
        const productswithoutfound = allproducts.filter(elemento => elemento.id !== parseInt(pid))
        await fs.promises.writeFile(this.path, JSON.stringify(productswithoutfound, null, 2))
    }

    // VALIDATE
    validateProduct = (obj) => {
        const { title, description, price, category, status, code, stock } = obj
        return !(title === undefined || description === undefined || price === undefined || category === undefined || status === undefined || code === undefined || stock === undefined)
    }
}
