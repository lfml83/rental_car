import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: Transporter;
    constructor() {
        // o .then é usado pq nao conseguimos usar um Async Await dentro do construtor
        nodemailer
            .createTestAccount()
            .then((account) => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                    tls: {
                        // usar iiso ao inves de process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; no app.ts
                        rejectUnauthorized: false,
                    },
                });

                this.client = transporter; // para tirar do construtor
            })
            .catch((err) => console.error(err));
    }
    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string
    ): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        const message = await this.client.sendMail({
            to,
            from: "Rentx <noreplay@rentex.com.br",
            subject,
            html: templateHTML,
        });
        console.log("Message sent: %s", message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export { EtherealMailProvider };
