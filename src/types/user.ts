export type User = {
    id: string,
    username: string,
    emailId?: null,
    phone: string,
    role: 'ADMIN' | 'SUPERADMIN' | 'HANDLER'
} | null