const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
  });

  const mailOptions = {

    from: process.env.EMAIL_USER,

    to: email,

    subject: "AI Quiz Builder - OTP Verification",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding:20px;
        background:#f5f5f5;
      ">

        <div style="
          max-width:500px;
          margin:auto;
          background:white;
          padding:30px;
          border-radius:10px;
        ">

          <h2 style="color:#111827;">
            AI Quiz Builder
          </h2>

          <p>
            Your One Time Password (OTP) is:
          </p>

          <h1 style="
            color:#d4af37;
            letter-spacing:5px;
          ">
            ${otp}
          </h1>

          <p>
            This OTP is valid for 10 minutes.
          </p>

          <p style="color:#777;">
            If you did not request this, ignore this email.
          </p>

        </div>

      </div>
    `,

  };


  await transporter.sendMail(mailOptions);

};


module.exports = sendOTPEmail;