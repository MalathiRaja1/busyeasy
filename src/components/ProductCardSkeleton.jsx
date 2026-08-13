import Skeleton from './Skeleton';

function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <Skeleton width="100%" height="180px" borderRadius="8px 8px 0 0" />
      <div className="product-info">
        <Skeleton width="60%" height="12px" className="skeleton-mb" />
        <Skeleton width="90%" height="16px" className="skeleton-mb" />
        <Skeleton width="40%" height="18px" className="skeleton-mb" />
        <Skeleton width="70%" height="12px" className="skeleton-mb" />
        <Skeleton width="100%" height="36px" borderRadius="4px" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;