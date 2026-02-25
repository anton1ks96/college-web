import type {FC} from "react";

interface TagBadgeProps {
  tag: string | null | undefined;
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const TagBadge: FC<TagBadgeProps> = ({
  tag,
  editable = false,
  onEdit,
  onRemove,
}) => {
  if (!tag && !editable) return null;

  if (!tag && editable) {
    return (
      <button
        onClick={onEdit}
        className="inline-flex items-center px-2 py-0.5 text-xs text-gray-500 hover:text-purple-600 transition-colors"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Добавить тег
      </button>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {tag}
      {editable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-blue-200 transition-colors"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {editable && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-blue-200 transition-colors"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </span>
  );
};
