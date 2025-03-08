import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [50, 'El nombre no puede superar los 50 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    inventory: {
        type: Number,
        required: [true, 'El inventario es obligatorio'],
        min: [0, 'El inventario no puede ser negativo']
    },
    available: {
        type: Boolean,
        default: function() { return this.inventory > 0; }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoría es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
    versionKey: false
});

ProductSchema.pre('save', function(next) {
    this.available = this.inventory > 0;
    next();
});

ProductSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();
    product.id = _id;
    return product;
};

export default model('Product', ProductSchema);