import nodemailer from 'nodemailer';



export const sendVerifyEmail = async({ email, code}:any) => {
    try {
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
          <h2 style="color: #333; margin-top: 0;">Hi!, User</h2>
          <p style="color: #555;">Here is your Verification Code:</p>
          <h1 style="color: #333;"> ${code}</h1>
        </div>
      </div>
      `
       

        const mailOptions = {
            from: 'babish@gmail.com',
            to: email,
            subject:"Email Verification",
            html: message
        }

        const mailresponse = await transporter.sendMail
        (mailOptions);
        return mailresponse;
    } catch (error:any) {

        throw new Error(error.message);
    }
}