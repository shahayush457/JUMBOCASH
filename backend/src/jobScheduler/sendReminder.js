let nodemailer = require("nodemailer");
const { email, password } = require("../config/config");

module.exports = async agenda => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password
    }
  });

  // Define a "job", an email sending function that agenda can execute
  // `job` is an object representing the job that agenda schedules.
  // `job.attrs` contains the raw document that's stored in MongoDB, so
  // `job.attrs.data` is how you get the `data` that application passes
  // to `schedule()`
  agenda.define("send email reminder", async job => {
    const {
      to,
      userName,
      transactionType,
      transactionMode,
      amount,
      remark,
      entityName,
      entityType,
      entityAddress,
      entityContactNo
    } = job.attrs.data;

    const mailOptions = {
      from: email,
      to: to,
      subject: "Reminder, pending transaction",
      html: `<h2>Hi ${userName}! You have a pending transaction.</h2>
             <h3>Transaction details</h3>
             <ol type="1">
             <li>Amount - ${amount}</li>
             <li>Transaction type - ${transactionType}</li>
             <li>Transaction mode - ${transactionMode}</li>
             <li>Remark - ${remark}</li>
             </ol>
             <h3>Entity details</h3>
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
