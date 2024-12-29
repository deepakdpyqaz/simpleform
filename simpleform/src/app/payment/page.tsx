// app/payment/page.tsx (or wherever you're using useSearchParams)
import { Suspense } from 'react';
import PaymentComponent from './PaymentComponent';

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentComponent />
        </Suspense>
    );
}
