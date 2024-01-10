const {cartModel} = require("./models/carts.model.js");
const {productModel} = require("./models/products.model.js");
const {userModel} = require("./models/users.model.js")
const {ticketModel} = require("./models/tickets.model.js")

class CartDao {
    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId).populate("products").lean();
            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAllCarts() {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createCart(newCart) {
        try {
            const cart = await cartModel.create(newCart);
            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addProductsToCart(cartId, products) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }
            if (Array.isArray(products)) {
                for (const productData of products) {
                    const productId = productData.productId;
                    const quantity = productData.quantity;
    
                    const product = await productModel.findById(productId);
                    if (!product) {
                        return { success: false, message: `Producto ${productId} no encontrado` };
                    }
                    cart.products.push({ product: productId, quantity });
                }
            } else {
                return { success: false, message: 'Formato de productos no válido' };
            }
    
            await cart.save();
    
            return { success: true, message: 'Productos agregados al carrito con cantidad' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al agregar productos al carrito con cantidad' };
        }
    }
    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }

            const productIndex = cart.products.findIndex(product => product.toString() === productId);
            if (productIndex === -1) {
                return { success: false, message: 'Producto no encontrado en el carrito' };
            }

            cart.products[productIndex].quantity = newQuantity;
            await cart.save();

            return { success: true, message: 'Cantidad de producto actualizada en el carrito' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al actualizar la cantidad del producto en el carrito' };
        }
    }

    async deleteCartById(cartId) {
        try {
            await cartModel.findByIdAndDelete(cartId);
            return { message: 'Carrito eliminado' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar el carrito' };
        }
    }

    async deleteAllProductsInCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            cart.products = [];
            await cart.save();

            return { message: 'Productos eliminados del carrito' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar los productos del carrito' };
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            const productIndex = cart.products.findIndex(product => product.toString() === productId);
            if (productIndex === -1) {
                return { error: 'Producto no encontrado en el carrito' };
            }

            const productToDelete = cart.products[productIndex];
            const productPrice = productToDelete.price;

            if (!isNaN(productPrice)) {
                cart.total = (cart.total || 0) - productPrice;
            }

            cart.products.splice(productIndex, 1);
            await cart.save();

            return { message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar el producto del carrito' };
        }
    }

    async getUserCart(userId) {
        try {
            const user = await userModel.findById(userId);
            if (!user || !user.cartId) {
                return null;
            }
    
            const cartId = user.cartId;
            const cart = await CartDao.getCartById(cartId);
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito del usuario');
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            const productIds = cart.products.map(product => product.product);
            const products = await productModel.find({ _id: { $in: productIds } });
            return products;
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            throw error;
        }
    }
        async checkProductIdsInDB(productIds) {
        try {
            const products = await productModel.find({ _id: { $in: productIds } });
            console.log('Products found in DB:', products);
        } catch (error) {
            console.error('Error al buscar productos por IDs:', error);
            throw error;
        }
    }
    
    async checkStock(cartProducts) {
        try {
            console.log("productos del carrito", cartProducts);
            for (const product of cartProducts) {
                console.log(`Verificando stock para producto ${product._id}`);
    
                const productInDB = await productModel.findById(product._id);
    
                if (!productInDB) {
                    console.log(`Producto ${product._id} no encontrado en la base de datos`);
                    return { success: false, message: "Producto no encontrado" };
                }
    
                const availableStock = productInDB.stock;
    
                if (product.quantity > availableStock) {
                    console.log(`Stock insuficiente para ${productInDB.title}`);
                    return { success: false, message: `Stock insuficiente para ${productInDB.title}` };
                }
    
                console.log(`Stock suficiente para ${productInDB.title}. Stock disponible: ${availableStock}`);
                console.log(`Stock antes de la actualización para ${productInDB.title}: ${productInDB.stock}`);
                productInDB.stock -= product.quantity;
                await productInDB.save();
                console.log(`Stock después de la actualización para ${productInDB.title}: ${productInDB.stock}`);
            }
    
            return { success: true, message: 'Stock disponible para todos los productos' };
        } catch (error) {
            console.error('Error al verificar el stock de productos:', error);
            throw error;
        }
    }

    async createTicket(ticketData) {
        try {
            const ticket = new ticketModel(ticketData);
            const savedTicket = await ticket.save();
            return savedTicket;
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            return null;
        }
    }
}

module.exports = CartDao;