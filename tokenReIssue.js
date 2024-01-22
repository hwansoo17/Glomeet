import config from './config';

export const tokenReIssue = async (email, refreshToken) => {
    try {
        const response = await fetch(`${config.SERVER_URL}token/re-issue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, refreshToken: refreshToken}),
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};