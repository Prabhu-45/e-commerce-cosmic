import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    lane1: {
        type: String,
        required: true,
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
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid pincode!`
        }
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'location'
});

const Location = mongoose.model('Location', addressSchema);

export default Location;
