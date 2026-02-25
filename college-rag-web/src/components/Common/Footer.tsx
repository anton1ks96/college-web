import type {FC} from "react";

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <p className="text-center text-xs sm:text-sm text-gray-400">
          <span className="block sm:inline">© 2021-2026 АНПОО "Колледж Цифровых Технологий"</span>
          <span className="hidden sm:inline"> • </span>
          <span className="block sm:inline">Авторы - студенты 2 курса: Иван Коломацкий, Артем Джапаридзе</span>
        </p>
      </div>
    </footer>
  );
};
