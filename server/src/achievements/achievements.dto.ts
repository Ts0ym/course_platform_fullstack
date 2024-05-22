export class CreateAchievementDto {
    title: string;
    description: string;// Путь к иконке достижения
    condition: string; // Условие для получения достижения
}

export class UpdateAchievementDto {
    title?: string;
    description?: string;
    condition?: string;
}