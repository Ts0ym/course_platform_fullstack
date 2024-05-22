class AmountPayment {
    value: number;
    currency: string;
}

class ObjectPayment {
    id: string
    status: string
    amount: AmountPayment
    description: string
    payment_method: {
        type: string
        id: string
        saved: boolean
        title: string
        account_number: number
    }
    captured_at: string
    created_at: string
}

export class PaymentStatusDto {
    type: string
    event: string
    object: {

    }
}