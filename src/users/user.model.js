import {Schema, model} from "mongoose";

const UserSchema = Schema({

    name: {
        type: String,
        required: [true, 'name in required'],
        maxLenght: [25, 'cant be overcome 25 characters']
    },
    surname:{
        type: String,
        required: [true, "apellido es requerido"],
        maxLenght: [25, "No puede sobrepasar los 25 caracteres"]
    },
    username:{
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es obligatoria']
    },
    phone: {
        type: String,
        minLenght: [8, "Numero de telefono no valido, escribir el numero sin guion ni espacios"],
        maxLenght: [8, "Numero de telefono no valido, escribir el numero sin guion ni espacios"],
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);