import axios from "axios";

export async function pearlGen(username: string, input: Promise<string>) {
    const prompt = await input;
    const resp = await axios.post('/api/generate', { username, prompt }, { validateStatus: undefined });
    if (resp.status === 200 && resp.data && resp.data.url) {
        const url = resp.data.url;
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username}.jpeg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        const msg = resp?.data?.error || `status ${resp.status}`;
        throw new Error(`generate failed: ${msg}`);
    }
}