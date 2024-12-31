// app/payment/page.tsx (or wherever you're using useSearchParams)
import { Suspense } from 'react';
import PaymentComponent from './PaymentComponent';
import Loader from '../components/Loader';

export default function PaymentPage() {
    return (
        <Suspense fallback={<Loader/>}>
            <PaymentComponent />
        </Suspense>
    );
}
