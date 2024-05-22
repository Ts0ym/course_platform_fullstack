export class CreateTariffDto {
    readonly name: string;
    readonly duration: number;
    readonly price: number;
    readonly freeConsultations: number;
    readonly course: string;
    readonly description: string;
}

export class UpdateTariffDto {
    readonly name?: string;
    readonly duration?: number;
    readonly price?: number;
    readonly freeConsultations?: number;
    readonly description?: string;
}