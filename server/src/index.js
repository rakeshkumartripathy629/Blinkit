// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import helmet from 'helmet';
// import dotenv from 'dotenv'
// dotenv.config()
// import connectDB from './config/connectDB.js';
// import userRouter from './route/user.route.js';
// import categoryRouter from './route/category.route.js';
// import uploadRouter from './route/upload.route.js';
// import subCategoryRouter from './route/subCategory.route.js';
// import productRouter from './route/product.route.js';
// import cartRouter from './route/cart.route.js';
// import addressRouter from './route/address.route.js';
// import orderRouter from './route/order.route.js';

// const app = express();


// // Hardcoded config
// const FRONTEND_URL = 'http://localhost:5173'; // change to your deployed frontend if needed
// const PORT = 8080; // or replace with process.env.PORT fallback logic if you ever introduce envs

// // CORS
// app.use(
//   cors({
//     credentials: true,
//     origin: FRONTEND_URL,
//   })
// );

// // Body & cookies
// app.use(express.json());
// app.use(cookieParser());

// // Logging: explicit format to avoid deprecation
// const logFormat = 'dev'; // or 'combined' for more verbose
// app.use(morgan(logFormat));

// // Security
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

// // Health check
// app.get('/', (req, res) => {
//   res.json({
//     message: `Server is running on port ${PORT}`,
//   });
// });

// // Routes
// app.use('/api/user', userRouter);
// app.use('/api/category', categoryRouter);
// app.use('/api/file', uploadRouter);
// app.use('/api/subcategory', subCategoryRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/address', addressRouter);
// app.use('/api/order', orderRouter);

// // Connect DB and start
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log('Server is running on port', PORT);
//   });
// });




import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.route.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

const app = express()
dotenv.config()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = 8080 || process.env.PORT 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})
