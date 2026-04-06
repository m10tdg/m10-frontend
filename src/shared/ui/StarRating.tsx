import { warning } from '@/shared/styles/colors'
import { Star } from 'lucide-react'

export function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i < count ? warning : "none"}
          style={{ color: warning }}
        />
      ))}
    </div>
  );
}