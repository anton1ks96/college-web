import type { FC } from "react";
import type { ColorScheme } from "./Pagination";

interface LoadingSpinnerProps {
  colorScheme?: ColorScheme;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const borderColorClasses: Record<ColorScheme, string> = {
  purple: 'border-purple-600',
  red: 'border-red-600',
  blue: 'border-blue-600',
  green: 'border-green-600',
  yellow: 'border-yellow-600',
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  colorScheme = 'purple',
  size = 'md',
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${borderColorClasses[colorScheme]}`}
      ></div>
    </div>
  );
};
