import axios from "axios";
import FormData from "form-data";
import fs from "fs";
async function getpearl(input: Promise<any>){
    const payload = await input;
    const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
        axios.toFormData(payload, new FormData()),
        {
            validateStatus:undefined,
            responseType: "arraybuffer",
            headers:{
                Authorization: `Bearer sk-APIKEY`,
                Accept:"image/*"
            },
        },
    );
    if(response.status === 200) {
        fs.writeFileSync("./lighthouse.webp", Buffer.from(response.data));
    } else {
        throw new Error(`${response.status}: ${response.data.toString()}`);
    }
}