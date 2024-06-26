import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === "production", // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "mdmuzahid.dev@gmail.com",
            pass: "qnoh ujtz quyz cjoo",
        },
    });


    // send mail with defined transport object
    await transporter.sendMail({
        from: "mdmuzahid.dev@gmail.com", // sender address
        to, // list of receivers
        subject: "Change your password within 10 minutes, PH-University", // Subject line
        text: "Hello", // plain text body
        html, // html body
    });

    console.log("Message sent: %s");
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

};