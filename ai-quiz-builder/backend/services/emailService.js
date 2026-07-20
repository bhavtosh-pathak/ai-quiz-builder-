const axios = require('axios');

const sendOTPEmail = async (email, otp) => {

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        name: "AI Quiz Builder",
        email: "bhavtoshpathak@gmail.com",
      },
      to: [{ email }],
      subject: "AI Quiz Builder - OTP Verification",
      htmlContent: `
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
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );

};

module.exports = sendOTPEmail;