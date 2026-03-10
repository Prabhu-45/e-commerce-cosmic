import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    products: [{
        id: String,
        title: String,
        price: String,
        img: String,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    address: {
        lane1: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9\s,.-/]+$/.test(v);
                },
                message: props => `${props.value} contains invalid characters!`
            }
        },
        lane2: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^[a-zA-Z0-9\s,.-/]+$/.test(v);
                },
                message: props => `${props.value} contains invalid characters!`
            }
        },
        country: String,
        state: String,
        district: String,
        pincode: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\d+$/.test(v);
                },
                message: props => `${props.value} is not a valid pincode!`
            }
        }
    },
    total: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Payment Incomplete"
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
