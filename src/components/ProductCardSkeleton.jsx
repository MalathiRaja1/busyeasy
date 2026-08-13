import Skeleton from './Skeleton';

function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page">
      <Skeleton width="140px" height="16px" className="skeleton-mb" />
      <div className="product-detail-container">
        <div className="product-detail-image">
          <Skeleton width="100%" height="350px" borderRadius="8px" />
        </div>
        <div className="product-detail-info">
          <Skeleton width="30%" height="12px" className="skeleton-mb" />
          <Skeleton width="70%" height="28px" className="skeleton-mb" />
          <Skeleton width="20%" height="24px" className="skeleton-mb" />
          <Skeleton width="100%" height="60px" className="skeleton-mb" />
          <Skeleton width="40%" height="14px" className="skeleton-mb" />
          <Skeleton width="180px" height="44px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;