import pearlRequest from "./pearlgen.ts";
const API_BASE="http://Localhost:36354/pearl";
async function getPearl(){
    const usernameInput = (document.getElementById("username") as HTMLInputElement | null)?.value ?? "";
    if (!usernameInput) {
        alert("请输入珍珠编号");
        return;
    }
    try{
        const response=await fetch(`${API_BASE}/pearl/${usernameInput}`);
        const data=await response.json();
        
    }catch(error){
        console.error("Error fetching pearl data:",error);
        alert("获取珍珠时出错，请稍后重试。");
    }
}