import {pearlGen} from "./pearlgen";
const API_BASE="http://Localhost:36354/pearl";
async function getPearl(){
    const usernameInput = (document.getElementById("username") as HTMLInputElement | null)?.value ?? "";
    const clickedButton = document.getElementById("getPearlBtn") as HTMLButtonElement | null;
    
    if(clickedButton){
        if (!usernameInput) {
            alert("请输入珍珠编号");
            return;
        }
        clickedButton.disabled = true;
        clickedButton.textContent = "获取中...";
        setTimeout(() => {
            if (clickedButton) {
                clickedButton.disabled = false;
                clickedButton.textContent = "获取珍珠";
            }
        }, 10000);
    }

    try{
        const text=await fetch(`${API_BASE}/pearl/${usernameInput}/text`);//获取纸条信息时自动生成用户名
        const textData=await text.json();
        pearlGen(usernameInput, textData);
    }catch(error){
        console.error("Error fetching pearl data:",error);
        alert("获取珍珠时出错，请稍后重试。");
    }
}