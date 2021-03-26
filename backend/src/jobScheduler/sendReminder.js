let nodemailer = require("nodemailer");
const { email, password } = require("../config/config");

function createText(transactionType, amount, entityName) {
  return transactionType === "debit"
    ? `You have to pay Rs ${amount} to ${entityName}`
    : `You will get Rs ${amount} from ${entityName}`;
}

module.exports = async agenda => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password
    }
  });

  agenda.define("send email reminder", async job => {
    const { to, transactionType, amount, entityName } = job.attrs.data;

    const mailOptions = {
      from: email,
      to: to,
      subject: "Reminder, pending transaction",
      text: createText(transactionType, amount, entityName)
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });
  });
};
