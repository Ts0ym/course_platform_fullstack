import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'achievements' })
export class Achievement {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    icon: string; // путь к иконке достижения

    @Prop({ required: true })
    condition: string; // условие для получения достижения (например, 'complete_10_courses')
}

export type AchievementDocument = Achievement & Document;
export const AchievementSchema = SchemaFactory.createForClass(Achievement);
