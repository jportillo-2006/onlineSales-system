import Category from '../Category/category.model.js';

export const getCategories = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener categorías',
            error
        });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newCategory = new Category({ name, description });

        await newCategory.save();

        res.status(201).json({
            success: true,
            msg: "Categoría registrada con éxito",
            category: newCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al registrar la categoría",
            error: error.message
        });
    }
};

export const updateCategory = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ success: false, msg: "Categoría no encontrada" });
        }

        res.status(200).json({
            success: true,
            msg: 'Categoría actualizada con éxito',
            category: updatedCategory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría desactivada con éxito',
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar la categoría',
            error
        });
    }
};