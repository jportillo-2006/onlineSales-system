import Product from "../Products/product.model.js";
import { response } from 'express';

export const addProduct = async (req, res) => {
    try {
        const { name, price, inventory } = req.body;

        const newProduct = new Product({ name, price, inventory });
        await newProduct.save();

        res.status(201).json({ msg: "Producto registrado con éxito", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor", error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { limite = 10, desde = 0, category } = req.query;
        const query = { estado: true };

        if (category) {
            const categoryFound = await Category.findOne({ name: category });

            if (!categoryFound) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }
            query.category = categoryFound._id;
        }

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category', 'name description')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener productos",
            error
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product || !product.estado) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado o desactivado'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener producto',
            error
        });
    }
};

export const getProductByName = async (req, res) => {
    try {
        const { name } = req.params;
        const product = await Product.findOne({ name: name, estado: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado o desactivado'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener producto',
            error
        });
    }
};

export const updateProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        res.status(200).json({
            success: true,
            msg: 'Producto actualizado con éxito',
            product: updatedProduct
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Producto desactivado con éxito',
            product,
            authenticatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar el producto',
            error
        });
    }
};