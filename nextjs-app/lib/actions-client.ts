'use client';

// Helper for client components to fetch from the server actions
// The Next.js compiler sometimes complains if we pass Server Actions directly into useEffect dependency arrays
export * from './actions-server';
