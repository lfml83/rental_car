/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IMailProvider } from "../IMailProvider";

class MailProviderInMemory implements IMailProvider {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private message: any[] = [];
    async sendMail(
        to: string,
        subject: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variables: any,
        path: string
    ): Promise<void> {
        this.message.push({
            to,
            subject,
            variables,
            path,
        });
    }
}

export { MailProviderInMemory };
