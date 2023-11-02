const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { app, mongoose, Product, Courses, Carts } = require('../server.js');
const { testData } = require('./testdata.js');

const expect = chai.expect;
chai.use(chaiHttp);

describe('GET /cart/:email', () => {
    it('should retrieve the user\'s cart along with course details', async () => {

        const findOneStub = sinon.stub(Carts, 'findOne').returns(Promise.resolve(testData.cartData));
        const findStub = sinon.stub(Courses, 'find').returns(Promise.resolve(testData.courseDetails));


        const username = "Brad@123"

        const res = await chai.request(app).get(`/cart/${username}`);


        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cartData');
        expect(res.body).to.have.property('courseDetails');
        expect(res.body.cartData).to.be.an('array').that.includes(testData.validCourseId);
        expect(res.body.courseDetails).to.be.an('array').that.has.lengthOf(1);


        sinon.restore();
    });


});

describe('DELETE /cart/remove/:email', () => {
    it('should remove an item from the user\'s cart', async () => {

        const findOneStub = sinon.stub(Carts, 'findOne').returns(Promise.resolve(testData.cartData));
        const saveStub = sinon.stub(mongoose.Model.prototype, 'save').returnsThis();

        const userEmail = 'Brad@123';
        const cartIdToRemove = 'CIS 194';


        const res = await chai.request(app)
            .delete(`/cart/remove/${userEmail}`)
            .send({ cartid: cartIdToRemove });


        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email', userEmail);
        expect(res.body.cartid).to.be.an('array').that.does.not.include(cartIdToRemove);


        sinon.restore();
    });


});
describe('POST /cart/add/:email', () => {

      afterEach(() => {
        sinon.restore();
    })
    // add item to cart wen user registered and exsisted in cart
    it('should add an item to the user\'s cart', async () => {

        const findOneProductStub = sinon.stub(Product, 'findOne').returns(Promise.resolve({ email: testData.validUserEmail }));
        const findOneCoursesStub = sinon.stub(Courses, 'findOne').returns(Promise.resolve({ id: testData.validCourseId }));
        const findOneCartsStub = sinon.stub(Carts, 'findOne').returns(Promise.resolve(testData.cartData))
        const findOneCartssaveStub = sinon.stub(mongoose.Model.prototype, 'save').returnsThis()



        const userEmail = testData.validUserEmail;
        const cartIdToAdd = testData.validCourseId;


        const res = await chai.request(app)
            .post(`/cart/add/${userEmail}`)
            .send({ cartid: cartIdToAdd });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email', userEmail);
        expect(res.body.cartid).to.be.an('array').that.includes(cartIdToAdd);


        sinon.restore();
    });


// user dint register trying to add to cart
it('should respond with "Please register to add to cart." when the user does not exist', async () => {
        
        const findOneProductStub = sinon.stub(Product, 'findOne').returns(null);
         const findOneCoursesStub = sinon.stub(Courses, 'findOne').returns(Promise.resolve({ id: testData.validCourseId }));


        const userEmail = 'nonexistentuser';
        const cartIdToAdd = 'item123'; 

        const res = await chai.request(app)
            .post(`/cart/add/${userEmail}`)
            .send({ cartid: cartIdToAdd });

        expect(res).to.have.status(200); 
        expect(res.text).to.equal('Please register to add to cart.');
        sinon.restore();
    }).timeout(5000);


//------------------------------

    // user has registered but not user not in cart
    it('should create a new cart when the user exists but does not have a cart', async () => {

        const findOneProductStub = sinon.stub(Product, 'findOne').returns(Promise.resolve({ email: testData.validUserEmail }));
        const findOneCoursesStub = sinon.stub(Courses, 'findOne').returns(Promise.resolve({ id: testData.validCourseId }));
        const findOneCartsStub = sinon.stub(Carts, 'findOne').returns(Promise.resolve(null));
        const findOneCartssaveStub = sinon.stub(mongoose.Model.prototype, 'save').returnsThis();

        const userEmail = testData.validUserEmail;
        const cartIdToAdd = testData.validCourseId;

        const res = await chai.request(app)
            .post(`/cart/add/${userEmail}`)
            .send({ cartid: cartIdToAdd });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email', userEmail);
        expect(res.body.cartid).to.be.an('array').that.includes(cartIdToAdd);
        sinon.restore();
    });

    
});

