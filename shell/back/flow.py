from fastapi import FastAPI
app=FastAPI()
@app.get("/pearl/{username}")
async def get_pearl(username: str):
    