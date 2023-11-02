const mongoose = require('mongoose')
const productSchema = mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required:true
        
        }


    }
)
const coursesSchema = mongoose.Schema(
    [{
        imgName: String,
        id: String,
        label: String,
        category: String,
        title: String,
        subtitle: String,
        content: String,
        multipleStartDate: Array,
        pathName: String,
        footerCtaText: String,
        selfPaced: Boolean,
        instructorLed: Boolean,
        proctored: Boolean
    }]


)
const cartSchema = mongoose.Schema(

    {
        email: {
            type: String,
            required: true
        },
        cartid: {
            type: Array,
            required: true
        }

    },

    { timestamps: true }

)

const Product = new mongoose.model('Product', productSchema)
const Courses = new mongoose.model('Courses', coursesSchema)
const Carts = new mongoose.model('Carts', cartSchema)

module.exports = { Product, Courses, Carts }