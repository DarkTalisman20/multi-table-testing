const express = require('express')
const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const Ticket = require('./models/tickets.model.js');
const Interaction = require('./models/interactions.model.js');
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.send("Testing Node API server");
});

// app.get('/products', async (req,res) =>{
//     try{
//         const products = await Product.find({});
//         res.status(200).json(products);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// });

// app.get('/product/:id', async (req,res)=>{
//     try{
//         const { id } = req.params;
//         const prod = await Product.findById(id);
//         res.status(200).json(prod);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// });

 app.post('/adduser',async (req,res) =>{
     try{
         const user = await User.create(req.body);
         res.status(200).json(user);
     }catch(error){
         res.status(500).json({message: error.message});
     }
 });

 app.post('/addticket',async (req,res) =>{
    try{
        const ticket = await Ticket.create(req.body);
        res.status(200).json(ticket);
    }catch(error){
        res.status(500).json({message: error.message});
    }
 });

// app.put('/product/:id', async (req,res) =>{
//     try{
//         const {id} = req.params;
//         const prod = await Product.findByIdAndUpdate(id,req.body);
//         if(!prod){
//             return res.status(404).json({message: "Product not found"});
//         }
//         const updatedprod = await Product.findById(id);
//         res.status(200).json(updatedprod);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// });

// app.delete('/product/:id', async (req,res) =>{
//     try{
//         const {id} = req.params;
//         const prod = await Product.findByIdAndDelete(id);
//         if(!prod){
//             return res.status(404).json({message: "Product not found"});
//         }
//         res.status(200).json({message: "Product deleted successfully"});
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// });

mongoose.connect("mongodb+srv://epsilon:multitabletesting@cluster0.k6guqe3.mongodb.net/multitable?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("MongoDB connected.");
    app.listen(3000, () => {
        console.log('Testing...');
    });
})
.catch(() => {
    console.log("Connection failed");
});