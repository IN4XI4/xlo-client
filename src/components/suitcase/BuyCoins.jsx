import React, { useEffect, useState } from 'react';
import { getCoinPackages, createCheckoutSession } from '../../api/wallet.api';
import { PackageCard } from './PackageCard';
import { ConfirmPurchaseModal } from './ConfirmPurchaseModal';

export function BuyCoins() {
  const [packages, setPackages] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCoinPackages()
      .then((res) => setPackages(res.data))
      .catch((err) => console.error('Error loading coin packages:', err));
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createCheckoutSession(selectedPkg.id, {
        success_url: `${window.location.origin}/purchase/success/`,
        cancel_url: `${window.location.origin}/suitcase/`,
      });
      window.location.href = res.data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedPkg(null);
    setError(null);
  };

  return (
    <div className="bg-[#FFF3EB] rounded-2xl p-4">
      <div className="font-semibold mb-4">Choose the amount to increase your balance.</div>
      <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPkg} />
        ))}
      </div>
      {selectedPkg && (
        <ConfirmPurchaseModal
          pkg={selectedPkg}
          isLoading={isLoading}
          error={error}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
