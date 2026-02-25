import type {FC} from "react";
import {useState} from "react";

interface TagEditorProps {
  initialValue?: string;
  onSave: (tag: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TagEditor: FC<TagEditorProps> = ({
  initialValue = "",
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSave(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="inline-flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите тег..."
        autoFocus
        disabled={isLoading}
        className="w-36 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading}
        className="inline-flex items-center justify-center w-6 h-6 rounded text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
