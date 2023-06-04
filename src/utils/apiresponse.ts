export type UserResponse = {
    user_mail: string;
    user_name: string;
    user_class: string;
    user_isadmin: boolean;
}

export type HistoryResponse = {
    class_name: string;
    timestamp: string;
    total: number;
    change: number;
    product: string;
}