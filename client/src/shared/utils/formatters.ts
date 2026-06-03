// Функции округления
export const roundToOne = (num: number): number => {
    return Math.round(num * 10) / 10;
};

export const roundToTwo = (num: number): number => {
    return Math.round(num * 100) / 100;
};

// Форматирование даты
export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU');
};

// Форматирование валюты
export const formatCurrency = (amount: number): string => {
    return roundToTwo(amount).toLocaleString() + ' ₽';
};

// Форматирование расстояния
export const formatDistance = (distance: number): string => {
    return roundToOne(distance).toLocaleString() + ' км';
};