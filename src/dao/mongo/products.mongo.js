const {productModel} = require("./models/products.model.js");

class ProductDao {
    async getProducts() {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async saveProduct(product) {
        try {
            const result = await productModel.create(product);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateProduct(id, product) {
        try {
            const result = await productModel.updateOne({ _id: id }, { $set: product });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = ProductDao;