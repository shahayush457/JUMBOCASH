let nodemailer = require("nodemailer");
const { email, password } = require("../config/config");

function createPaymentText(transactionType, amount, entityName) {
  return transactionType === "debit"
    ? `You have a pending payment of Rs ${amount} to ${entityName}`
    : `You have a pending payment of Rs ${amount} from ${entityName}`;
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
    const {
      to,
      transactionType,
      transactionMode,
      amount,
      remarks,
      entityName,
      entityType,
      entityAddress,
      entityContactNo
    } = job.attrs.data;

    const mailOptions = {
      from: email,
      to: to,
      subject: "Reminder, pending transaction",
      text: `<h1>You have a pending transaction.</h1>
             <h2>Transaction details</h2>
             <ol type="1">
             <li>Amount - ${amount}</li>
             <li>Transaction type - ${transactionType}</li>
             <li>Transaction mode - ${transactionMode}</li>
             <li>Remarks - ${remarks}</li>
             </ol>
             <h2>Entity details</h2>
             <ol type="1">
             <li>Name - ${entityName}</li>
             <li>Entity Type - ${entityType}</li>
             <li>Address - ${entityAddress}</li>
             <li>Contact No - ${entityContactNo}</li>
             </ol>
             `
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
