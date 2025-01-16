import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { chargeCalculator } from './chargeUtils';
import cache from "./cache";
import { RegistrationType } from '@/app/constants';


export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
}
const templateReader = async (filePath: string) => {
  const cachedTemplateSource = await cache.get(filePath);
  if (cachedTemplateSource) {
    return cachedTemplateSource;
  }
  const templateSource = await fs.promises.readFile(filePath, { encoding: "utf-8" });
  cache.set(filePath, templateSource);
  return templateSource;
}
export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
}: MailOptions): Promise<void> {
  // Configure the SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP details of your provider
    auth: {
      user: process.env.EMAIL_USERNAME, // Email address
      pass: process.env.EMAIL_PASSWORD, // App password or email password
    },
  });

  // Email details
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
    attachments, // Attachments are now included here
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
const MAIL_SUBJECT = "Registration confirmation for Saranagati Retreat (Feb 23 - Mar 1)";
const MAIL_BODY = `
Hare Krsna dear devotee,
Please accept my humble obeisances. All glories to Srila Prabhupada.
Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)`
const MAIL_HTML = `
<p><strong>Hare Krsna dear devotee,</strong></p>
<p>Please accept my humble obeisances. All glories to Srila Prabhupada.</p>
<p>Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)</p>
`;
const attachments = [
    {
        filename: "GRC_QRcode.pdf",
        path: "./public/GRC_QRcode.pdf"
    },
    {
        filename: "Saranagati_Retreat_Brochure.pdf",
        path: "./public/Saranagati_Retreat_Brochure.pdf"
    }
]

const roomTypeMap = {
  "2AB": "One spot in 2 sharing room",
  "3AB": "One spot in 3 sharing room",
  "4AB": "One spot in 4 sharing room",
  "6NAB": "One spot in 6 sharing room with non-attached bathroom"
}
const sendSuccessEmail = async (userData: any) => {

  const filePath = path.join(process.cwd(), 'templates', `successmail.html`);
  const templateSource = await templateReader(filePath);
  const template = handlebars.compile(templateSource);
  const {foodPrice, partialRetreatPrice, accommodationPrice, departureLunchPrice, arrivalLunchPrice, totalPrice, discount, finalPrice} = await chargeCalculator(userData);
  const roomList = ["2AB", "3AB", "4AB", "6NAB"];
  let roomTypeInfo = "";
  let isRoomSelected = false;
  if(userData.registrationType === RegistrationType.FRWA){
    const selectedRoom = roomList.filter((room) => userData.roomQuantity[room] > 0)[0];
    roomTypeInfo = `${roomTypeMap[selectedRoom as keyof typeof roomTypeMap]} for ${userData.personalDetails[0].gender=='male'?'gents':'ladies'}`;
    isRoomSelected = true;
  }
  const variables = {
    transactionTime: new Date().toLocaleString(),
    transactionId: userData._id, 
    groupSize: userData.groupSize,
    partialRetreatCharges: partialRetreatPrice,
    accommodationCharges: accommodationPrice,
    foodCharges: foodPrice,
    arrivalLunchCharges: arrivalLunchPrice,
    departureLunchCharges: departureLunchPrice,
    discount: discount,
    totalCharges: finalPrice,
    isRoomSelected: isRoomSelected,
    roomTypeInfo: roomTypeInfo,
  };
  const html = template(variables);
  const mailOptions: MailOptions = {
      to: userData.email,
      subject: MAIL_SUBJECT,
      text: html.toString(),
      html: html,
      attachments: attachments
  }
  sendEmail(mailOptions);
}

export { sendSuccessEmail };