import httpx
import requests
from config import settings
from main.web.pearl.stdf import STABILITY_KEY
class AIModels:
    @staticmethod
    async def img2text(username: str, imgurl: str):
        api_key = settings.SILICONFLOW_API_KEY
        url = settings.IMAGE2TEXT_API_URL
        payload = {
            "model": settings.IMG2TEXT_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "image_url": {
                                "detail": "auto",
                                "url": imgurl
                            },
                            "type": "image_url"
                        },
                        {
                            "type": "text",
                            "text": "读取图片中的文字，如果文段不完整，请根据大意补全。理解文字中蕴含的情绪，用英文生成能够展现这一情绪的珍珠的设计描述性文字，细节详细"
                        }
                    ]
                }
            ],
            "stream": False,
            "max_tokens": 4096,
            "enable_thinking": False,
            "thinking_budget": 4096,
            "min_p": 0.05,
            "stop": [],
            "temperature": 0.7,
            "top_p": 0.7,
            "top_k": 50,
            "frequency_penalty": 0.5,
            "n": 1,
            "response_format": {"type": "text"},
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "description": "<string>",
                        "name": "<string>",
                        "parameters": {},
                        "strict": False
                    }
                }
            ]
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
        return response.json()
    
    @staticmethod
    async def pearlGen(prompt:str):
        api_key=settings.STABILITY_API_KEY
        url=settings.STABILITY_API_URL
        headers = {
            "Accept": "image/*",
            "Authorization": f"Bearer {api_key}"
        }
        params={
            "prompt" : prompt,
            "aspect_ratio" : "1:1",
            "seed" : 0,
            "output_format" : "jpeg",
            "model" : settings.STABILITY_MODEL,
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                files={"none":''},
                data=params
            )
            return response.content
        