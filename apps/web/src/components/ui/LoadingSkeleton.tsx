import { cn } from '../../lib/cn';

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-white/5', className)} />;
}

export function MatchCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-8 w-12 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-full rounded" />
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
