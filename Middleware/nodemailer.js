const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: 'umerbilalgujjar123@outlook.com',
    pass: 'UmerBilalGujjar242@',
  },
});

// Generate a random OTP
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const otpMap = new Map();

function sendEmailWithOTP(req, res, next) {
  const { email } = req.body;
  const otp = generateOTP();
  otpMap.set(email, otp);
  const mailOptions = {
    from: 'umerbilalgujjar123@outlook.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      console.log('Email sent:', info.response);
      req.generatedOTP = otp;
      next();
    }

  });
}

module.exports = {
  sendEmailWithOTP,generateOTP,otpMap
};