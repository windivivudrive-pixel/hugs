export * from './actions-server';
export * from './types';

// Mock functions since backend is deferred
export const uploadCV = async (file: File) => {
    console.log("Mock CV Uploaded:", file.name);
    return { url: "https://hugs.agency/mock-cv-url.pdf", error: null as any };
};

export const uploadThumbnail = async (file: File, folder?: string) => ({ url: "https://mock", error: null as any });
export const deleteThumbnail = async (url: string) => {};

export const supabase: any = {
    auth: {
        getSession: async () => ({ data: { session: null as any } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (table: string) => ({
        select: (cols?: string) => ({
            eq: (col: string, val: any) => ({
                order: (col: string, opts?: any) => ({
                    limit: async (num: number) => ({ data: [], error: null })
                }),
                limit: async (num: number) => ({ data: [], error: null }),
                then: (resolve: any) => resolve({ data: [], error: null })
            }),
            order: (col: string, opts?: any) => ({
                limit: async (num: number) => ({ data: [], error: null }),
                then: (resolve: any) => resolve({ data: [], error: null })
            }),
            then: (resolve: any) => resolve({ data: [], error: null })
        }),
        insert: async (data: any) => ({ error: null }),
        update: (data: any) => ({
            eq: async (col: string, val: any) => ({ error: null })
        }),
        delete: () => ({
            eq: async (col: string, val: any) => ({ error: null })
        })
    })
};
