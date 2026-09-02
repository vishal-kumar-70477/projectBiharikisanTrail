const nodemailer = require("nodemailer")
const config = require("../config/config")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAUTH2",
        user:config.GOOGLE_USER,
        clientId:config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        refreshToken:config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log("Error: Connecting to email server",error);
    }
    else{
        console.log("Email server ready to send messages");
    }
})

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
      console.log("Message ID:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);
        console.log("Response:", info.response);

        return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;