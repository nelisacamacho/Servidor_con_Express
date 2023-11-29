import express from 'express';
import productManager from './ProductManager.js';
const PORT = 8080;
const app = express();

app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query // http://localhost:8080/products?limit=1
        const products = await productManager.getProducts();
        if(!limit || limit <= 0) {
            res.send(products);
        } else {
            res.send(products.slice(0, limit));
        }
    } catch (error) {
        console.log(error, error);
        res.send(error)
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const {id, title, description, price, thumbnail, code, stock} = await productManager.getProductById(+pid);
        res.send(`
                <p style="font-weight:bolder">Id: ${id}</p>
                <h1 style="color:blue">Title: ${title}</h1>
                <p style="font-weight:bolder">Description: <span style="font-weight:100">${description}</span></p>
                <p style="font-weight:bolder">Price: <span style="font-weight:100">$ ${price}<span></p>
                <p style="font-weight:bolder">Stock: <span style="font-weight:100">${stock}</span></p>
                <img style="width:auto; height:40rem" src=${thumbnail} alt=Image>
            `)
    } catch (error) {
        res.send(error)
    }
});


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});