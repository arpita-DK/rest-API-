const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { Product } = require('./models/productModel')
const { Courses } = require('./models/productModel')
const { Carts } = require('./models/productModel');



const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:8080', 
    credentials: true, 
}));
app.use(cookieParser());
module.exports = { app, mongoose, Product, Courses, Carts };

//DB CONNECTION
mongoose.connect('mongodb+srv://arpita:arpita123@cluster0.olfrjn4.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log("connected to db")
    })
    .catch((error) => {
        console.log("cant connect to db")
    })

//route



//REGISTER 
app.post('/', async (req, res) => {
    try {
        console.log("inserting")

        const email1 = req.body.email
        const find1 = await Product.findOne({ email: email1 })
        if (!find1) {
            const product = await Product.create(req.body)
            res.status(200).send("registration successfull")
        }
        else {
            res.status(409).send("details already exsist ,please login")
        }
    } catch (error) {
        res.status(500).send("failed to register,TRY AGAIN", error.message)

    }



}
)

//FETCH -courses
app.get('/courses', async (req, res) => {
    try {
        console.log('fetch courses');
        const courses = await Courses.find({});
        console.log('Courses:', courses); // Log the courses data
        res.send(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});







//LOGIN

app.post('/login', async (req, res) => {
    try {
        const user = await Product.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User does not exist");
        }

        if (user.password === req.body.password) {
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
    res.cookie('login', 'true', { maxAge: 3600000, httpOnly: true }); 
  res.status(200).send("Login successful");
});




// ADD TO CART
//****** */
app.post('/cart/add/:email/:courseId', async (req, res) => {
    try {
        console.log("add proccessed")
        const email = req.params.email;
        console.log("received just email" ,email)
        const courseId=req.params.courseId;

       


        const userExists = await Product.findOne({ email });

        console.log("entring if")
        console.log("Received email:", email);
        console.log("Received courseId:", courseId);
        if (userExists) {
            console.log("if userexsit")
            let cart = await Carts.findOne({ email });

            if (!cart) {
                console.log("user dont exsist")
                cart = new Carts({
                    email:email,
                    cartid: [courseId],
                });
            } else {
                console.log("find the item ")
                const cartidExists = cart.cartid.find((item) => item === courseId);


                if (!cartidExists) {
                    console.log("adding...")
                    cart.cartid.push(courseId);
                } else {
                    res.send("Item already in the cart.");
                    return;
                }
            }

            // Use await when saving the cart
            await cart.save();
            const cartnum=cart.cartid;
       console.log(cartnum);
            res.json(cart);
        } else {
            res.send("Please register to add to cart.");
        }
    } catch (error) {
        console.error('Error adding new cartid:', error);
        res.status(500).send('Error adding new cartid');
    }
});





// FETCH CART ALONG WITH COURSE DETAILS
app.get('/cart/:email', async (req, res) => {
    try {
        console.log("getting cart")
        const { email } = req.params;
        console.log("email got here", email)
        const cart = await Carts.findOne({ email });

        if (!cart) {
            return res.status(404).send(`Cannot find the cart for email: ${email}`);
        }


        const cartData = cart.cartid;

console.log("cartdata is ",cartData)
      res.send(cartData)  


       // res.json({ cartData, courseDetails });
    } catch (error) {
        console.log('Error in fetching cart and course details:', error);
        res.status(500).send('Internal Server Error-Error in fetching cart and course details:');
    }
});





//DELETE FROM CART
app.delete('/cart/remove/:email/:courseId', async (req, res) => {
    try {
        console.log("delete processing")
        const email = req.params.email;
        console.log("received email" ,email)
        const courseId=req.params.courseId;


        const cart = await Carts.findOne({ email });

        if (!cart) {
            return res.status(404).send(`Cannot find the cart for email: ${email}`);
        }

         console.log("course id is ",courseId)
        const updatedCartid = cart.cartid.filter(cartId => cartId !== courseId);


        cart.cartid = updatedCartid;
        
            await cart.save();
        


        res.json(cart);
    } catch (error) {
        console.error('Error removing cartid:', error);
        res.status(500).send('Error removing cartid:');
    }
});






app.listen(9000, () => {
    console.log("running on port 9000")
})