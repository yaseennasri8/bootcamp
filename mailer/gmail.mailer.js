const nodeMailer = require('nodemailer');
class GmailMailer {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USER_NAME,
                pass: process.env.GMAIL_PASSWORD
            },
        });
    }
    async sendPasswordResetGmail(to, token) {
        let info = await this.transporter.sendMail({ 
        from: process.env.GMAIL_USER_NAME,
        to: "yaseen.ahmed@virtualforce.io",
        subject: "Bootcamp - Instruction for reseting your password",
        text: `Please use the following token to reset this password: ${token}` 
    });
    }

}
module.exports = GmailMailer;