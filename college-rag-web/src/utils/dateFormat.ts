/**
 * Форматирует дату в локализованный формат
 * @param dateString - ISO строка даты
 * @returns Форматированная дата
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

/**
 * Форматирует дату в короткий формат (для таблиц)
 * @param dateString - ISO строка даты
 * @returns Форматированная дата в коротком формате
 */
export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
