import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [50, 'El nombre no puede superar los 50 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        maxLength: [200, 'La descripción no puede superar los 200 caracteres']
    },
    estado: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
});

categorySchema.methods.toJSON = function() {
    const { __v, _id, ...category } = this.toObject();
    category.id = _id;
    return category;
};

export default model('Category', categorySchema);