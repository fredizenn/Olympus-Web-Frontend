import { client } from ".";

export async function UserLogin (username: string, password: string) {
    try {
        const response = await client.post('User/Login', {
            username,
            password
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
}

