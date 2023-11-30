//! Consigna
//? Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

//* Aspectos a incluir
//? Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
//? Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.

//* Aspectos a incluir
//? El servidor debe contar con los siguientes endpoints:
    //* ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. 
    //* Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
    //* Si no se recibe query de límite, se devolverán todos los productos
    //* Si se recibe un límite, sólo devolver el número de productos solicitados
    //* ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado,
    //* en lugar de todos los productos. 

//* Sugerencias
//? Tu clase lee archivos con promesas. recuerda usar async/await en tus endpoints
//? Utiliza un archivo que ya tenga productos, pues el desafío sólo es para gets. 

// const fs = require('fs');
import fs from 'fs';
class ProductManager {

    constructor(path) {
        this.path = path;
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            return console.error('All fields are required, please verify.');
        }
        const products = await this.getProducts();
        if(products.find(product => product.code === code)) {
            return console.error(`Code ${code} already exists, please verify.`);
        }
        const newProduct = {
            id: await this.#generateId(),
            title, 
            description, 
            price: Number(price),
            thumbnail, 
            code, 
            stock: Number(stock)
        }
        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
        return newProduct;
    }

    #generateId = async () => {
        try {
            const products = await this.getProducts();
            if(products.length === 0) {
                return 1;
            }
            return products[products.length - 1].id + 1;
        } catch (error) {
            console.error(error)
        }
    }

    getProducts = async () => {
        try {
            const datos = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(datos);
            return products;
        } catch (error) {
            console.error('No hay datos')
            return [];
        }
    }
    
    getProductById = async (productId) => {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId);
        } catch (error) {
            console.error(error)
        }
    }

    updateProduct = async (productId, value) => {
        try {
            if(!productId || !value) return console.error('Must provide the required information to update a product')
            let products = await this.getProducts();
            const product = await products.find(product => product.id === productId);
            const productIdx = await products.findIndex(product => product.id === productId);
            console.log(productId);
            products[productIdx] = {
                ...product,
                ...value,
                'id': productId
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return this.getProductById(productId);
        } catch (error) {
            console.error(error)
        }
    }

    deleteProduct = async (productId) => {
        try {
            console.log('llamada desde el ervidor', productId);
            const product = await this.getProductById(productId);
            if(!product) return `Product with ID ${productId} does not exist.`
            const products = await this.getProducts();
            const productIdx = products.findIndex(product => product.id === productId);
            products.splice(productIdx, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            return products;
        } catch (error) {
            console.error(error)
        }
    }
}

const productManager = new ProductManager('./Products.json')
export default productManager;

