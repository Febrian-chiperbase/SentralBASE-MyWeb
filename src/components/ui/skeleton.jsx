import React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
};

// Skeleton components untuk berbagai use cases
const SkeletonCard = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
  </div>
);

const SkeletonPricing = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-8 w-1/4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

const SkeletonHero = () => (
  <div className="text-center space-y-6 py-20">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <Skeleton className="h-12 w-48 mx-auto" />
  </div>
);

export { Skeleton, SkeletonCard, SkeletonPricing, SkeletonHero };
