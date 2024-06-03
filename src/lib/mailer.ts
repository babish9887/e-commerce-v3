import nodemailer from 'nodemailer';



export const sendEmail = async({email, firstname,  price, product}:any) => {
    try {
        // create a hased token
      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                  user: process.env.USER_EMAIL, 
                  pass: process.env.USER_PASSWORD
            },
        });


        let message=`
        
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f2f2f2;">
        <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 20px auto; max-width: 400px;">
          <h2 style="color: #333; margin-top: 0;">Hi!, ${firstname}</h2>
          <p style="color: #555;">Here is your receipt:</p>
          <h1 style="color: #333;">Product Name: ${product}</h1>
          <h4 style="color: #333;">Product purchased Date: ${new Date(Date.now())}</h4>
          <p style="color: #555;">Price Paid: ${price}</p>
          <p style="color: #555;">You can download the Product from "My Orders" page</p>
          
          <a href="https://babish9887-ecommerce-nextjs.vercel.app/orders" style="background-color: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin-top: 20px; display: inline-block;">Go to My Orders Page</a>
        </div>
      </div>
      `
       

        const mailOptions = {
            from: 'babish@gmail.com',
            to: email,
            subject:"Get the Product",
            html: message
        }

        const mailresponse = await transporter.sendMail
        (mailOptions);
        return mailresponse;
    } catch (error:any) {
        throw new Error(error.message);
    }
}