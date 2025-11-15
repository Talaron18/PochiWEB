// ================================================
// result.ts
// TypeScript 实现：情绪珍珠前端逻辑（异步AI调用版）
// ================================================

// 接口定义：后端返回珍珠信息结构
interface PearlResult {
  pearlImageUrl: string;
  comfortText: string;
}

// 元素获取
const pearlImage = document.getElementById("pearl-image") as HTMLImageElement;
const responseText = document.getElementById("response-text") as HTMLElement;
const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement;
const popup = document.getElementById("popup") as HTMLElement;
const closePopup = document.getElementById("closePopup") as HTMLButtonElement;

// API Keys（⚠️ 开发阶段使用，部署时请改为后端代理）
const GLM_API_KEY: string = "8b3f6c581c26415a8b14f9486dc324fa.jWpjkDN97CHNRWoX";
const SILICON_API_KEY: string = "sk-xrmedevcpxynmdctolizaolsbxxqzsrkeumqupaixxwxkapi";

// =============================
// 异步函数：调用AI模型生成提示词
// 支持两种模式：
// "qwen"  → Qwen3-VL-8B-Instruct
// "glm+deepseek" → GLM-4v-flash + DeepSeek
// =============================
async function getPromptFromAI(
  imageUrl: string,
  mode: "qwen" | "glm+deepseek" = "qwen"
): Promise<string> {
  try {
    if (mode === "qwen") {
      // ========== 方案一：Qwen3-VL 一步识别+生成 ==========
      const qwenResp = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SILICON_API_KEY}`
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2-VL-7B-Instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "读取图片中的文字，理解文字中蕴含的情绪，用英文生成能够展现这一情绪的珍珠的设计描述性文字，细节详细。"
                },
                { type: "image_url", image_url: imageUrl }
              ]
            }
          ]
        })
      });

      const qwenData = await qwenResp.json();
      const resultText = qwenData?.choices?.[0]?.message?.content || "";
      return resultText || "A soft glowing pearl representing calm emotion.";

    } else {
      // ========== 方案二：GLM4v + DeepSeek ==========
      // Step 1️⃣：GLM4v 识别文字
      const glmResp = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GLM_API_KEY}`
        },
        body: JSON.stringify({
          model: "glm-4v-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "识别图片中的手写文字，只输出文字内容，不解释。" },
                { type: "image_url", image_url: imageUrl }
              ]
            }
          ]
        })
      });

      const glmData = await glmResp.json();
      const recognizedText: string = glmData?.choices?.[0]?.message?.content || "";

      // Step 2️⃣：DeepSeek 根据文字生成提示词
      const deepResp = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SILICON_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-coder-v2-lite-instruct",
          messages: [
            {
              role: "user",
              content: `The user wrote: "${recognizedText}". Please describe a pearl image that represents the emotion in this text. Use detailed English descriptions.`
            }
          ]
        })
      });

      const deepData = await deepResp.json();
      const finalPrompt: string = deepData?.choices?.[0]?.message?.content || "";
      return finalPrompt || "A glowing pearl with gentle colors reflecting sadness.";
    }
  } catch (error) {
    console.error("AI调用失败:", error);
    return "A mysterious pearl radiating quiet emotion.";
  }
}

// =============================
// 主函数：加载珍珠结果并更新UI
// =============================
async function loadPearlResult(): Promise<void> {
  responseText.textContent = "🧠 正在识别文字并生成珍珠...";

  const imageUrl: string = "https://shell.kenxu.top/uploads/latest_paper.jpg"; // 从后端获得图片URL

  // 调用AI生成提示词（你可以切换模式："qwen" / "glm+deepseek"）
  const prompt: string = await getPromptFromAI(imageUrl, "glm+deepseek");

  // 调用后端生成珍珠图像
  const genResp = await fetch("https://shell.kenxu.top/api/generate_pearl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const genData: PearlResult = await genResp.json();

  // 更新页面内容
  pearlImage.src = genData.pearlImageUrl;
  responseText.textContent = genData.comfortText || "✨ 你的珍珠已经准备好啦！";
}

// 调用主函数
loadPearlResult();

// =============================
// 下载弹窗交互逻辑
// =============================
downloadBtn.addEventListener("click", (): void => {
  popup.classList.remove("hidden");

  // 2 秒后自动隐藏
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 2000);
});
