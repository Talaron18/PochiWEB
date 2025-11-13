from fastapi import FastAPI
import requests
app=FastAPI()
APIKEY="sk-YqKFNojDJyL6ZwrNG29ARuQ5z0KDjcGD8PtehQQaPTRmZoZc"
@app.get("/pearl/{username}/img")

def send_generation_request(
    host,
    params,
):
    headers = {
        "Accept": "image/*",
        "Authorization": f"Bearer {APIKEY}"
    }

    files = {}
    image = params.pop("image", None)
    mask = params.pop("mask", None)
    if image is not None and image != '':
        files["image"] = open(image, 'rb')
    if mask is not None and mask != '':
        files["mask"] = open(mask, 'rb')
    if len(files)==0:
        files["none"] = ''

    print(f"Sending REST request to {host}...")
    response = requests.post(
        host,
        headers=headers,
        files=files,
        data=params
    )
    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text}")

    return response

async def gen_pearl(username: str):
    prompt = requests.get(f"http://Localhost:36354/pearl/{username}/text").text,
    aspect_ratio = "1:1" 
    seed = 0 
    output_format = "jpeg" 

    host = f"https://api.stability.ai/v2beta/stable-image/generate/sd3"

    params = {
        "prompt" : prompt,
        "negative_prompt" : "deformed,blurry,things other than pearl",
        "aspect_ratio" : aspect_ratio,
        "seed" : seed,
        "output_format" : output_format,
        "model" : "sd3.5-flash"
    }

    response = send_generation_request(
        host,
        params
    )

    output_image = response.content
    finish_reason = response.headers.get("finish-reason")
    seed = response.headers.get("seed")

    if finish_reason == 'CONTENT_FILTERED':
        raise Warning("Generation failed NSFW classifier")

    generated = f"generated_{seed}.{output_format}"
    with open(generated, "wb") as f:
        f.write(output_image)
    print(f"Saved image {generated}")