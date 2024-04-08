import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export enum FileTypes{
    AUDIO = "audio",
    IMAGE = "image",
    VIDEO = "video"
}

@Injectable()
export class FilesService {
    async createFile(file, fileType: FileTypes): Promise<string> {
        try {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuidv4() + '.' + fileExtension;
            const uploadPath = path.resolve(__dirname, '..', '..', 'static', fileType);
            const filePath = path.join(uploadPath, fileName);

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            // Создаем поток для записи файла на диск
            const writeStream = fs.createWriteStream(filePath);

            // Промисифицируем событие 'finish', чтобы убедиться, что файл полностью записан на диск перед возвратом из функции
            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    resolve(fileName); // Возвращаем имя файла после полной загрузки
                });
                writeStream.on('error', (error) => {
                    reject(error);
                });

                // Пишем данные из буфера в поток
                writeStream.write(file.buffer);

                // Завершаем запись
                writeStream.end();
            });

            return fileName;
        } catch (e) {
            throw new HttpException(`Ошибка при загрузке файла ${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteFile(){

    }
}
