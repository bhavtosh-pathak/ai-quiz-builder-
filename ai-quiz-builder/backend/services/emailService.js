const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {

  await resend.emails.send({
    from: 'AI Quiz Builder <onboarding@resend.dev>',
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
  });

};

module.exports = sendOTPEmail;