import { Injectable } from '@nestjs/common';
import {
    APP_DOMEN_NAME,
    POST_APP_PASSWORD,
    POST_SERVICE_MAIL,
    RESET_PASSWORD_URL
} from "../constants";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth: {
                user: POST_SERVICE_MAIL,
                pass: POST_APP_PASSWORD
            }
        })
    }

    sendActivationEmail(to: string, activationToken: string) {
        const mailOptions = {
            from: POST_SERVICE_MAIL,
            to,
            subject: 'Активация аккаунта',
            text: '',
            html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Активация аккаунта</title>
                            <style>
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    font-family: Arial, sans-serif;
                                    background-color: #f7f7f7;
                                    border-radius: 10px;
                                }
                        
                                .header {
                                    text-align: center;
                                    margin-bottom: 20px;
                                }
                        
                                .content {
                                    text-align: center;
                                }
                        
                                .button {
                                    display: inline-block;
                                    padding: 10px 20px;
                                    background-color: #007bff;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                        
                                .button:hover {
                                    background-color: #0056b3;
                                }
                            </style>
                        </head>
                        <body>
                        <div class="container">
                            <div class="header">
                                <h1>Активация аккаунта</h1>
                            </div>
                            <div class="content">
                                <p>Для активации вашего аккаунта перейдите по следующей ссылке:</p>
                                <a class="button" href="${APP_DOMEN_NAME}/auth/activate/${activationToken}">Активировать аккаунт</a>
                            </div>
                        </div>
                        </body>
                        </html>`
        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
    }

    sendResetPasswordEmail(to: string, resetToken: string){
        const mailOptions = {
            from: POST_SERVICE_MAIL,
            to,
            subject: 'Восстановление пароля',
            text: '',
            html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Восстановление пароля</title>
                            <style>
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    font-family: Arial, sans-serif;
                                    background-color: #f7f7f7;
                                    border-radius: 10px;
                                }
                        
                                .header {
                                    text-align: center;
                                    margin-bottom: 20px;
                                }
                        
                                .content {
                                    text-align: center;
                                }
                        
                                .button {
                                    display: inline-block;
                                    padding: 10px 20px;
                                    background-color: #007bff;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                        
                                .button:hover {
                                    background-color: #0056b3;
                                }
                            </style>
                        </head>
                        <body>
                        <div class="container">
                            <div class="header">
                                <h1>Восстановление пароля</h1>
                            </div>
                            <div class="content">
                                <p>Для восстановления пароля перейдите по следующей ссылке:</p>
                                <a class="button" href="${RESET_PASSWORD_URL}${resetToken}">Восстановить пароль</a>
                            </div>
                        </div>
                        </body>
                        </html>`
        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
    }
}
