/**
 * Skeleton loader for chat messages, shown during initial data fetch.
 * Mimics the layout of alternating user and bot message bubbles.
 */
export default function LoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-4 p-4" aria-hidden="true" role="presentation">
      {/* Bot message skeleton */}
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded-2xl rounded-tl-sm animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* User message skeleton */}
      <div className="flex items-end flex-row-reverse gap-2">
        <div className="space-y-2 items-end flex flex-col">
          <div className="h-8 w-40 bg-civic-blue-200 rounded-2xl rounded-tr-sm animate-pulse" />
          <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Bot message skeleton 2 */}
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-16 w-72 bg-gray-200 rounded-2xl rounded-tl-sm animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
