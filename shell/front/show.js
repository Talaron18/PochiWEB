document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("pearl-video");
  const content = document.getElementById("pearl-content");
  const pearlImg = document.getElementById("pearl-image");
 

  // 从 URL 获取珍珠ID
  const pathParts = window.location.pathname.split("/");
  const pearlId = pathParts[pathParts.length - 1] || "default";

  
  video.addEventListener("ended", async () => {
    // 视频消失然后转到珍珠图片
    video.style.transition = "opacity 1s ease-in-out";
    video.style.opacity = "0";

    setTimeout(async () => {
      video.style.display = "none";
      content.classList.add("show");

      try {
        // 向后端请求珍珠数据
        const response = await fetch(`/api/get_pearl_info/${pearlId}`);
        const data = await response.json();

        // 显示图像
        pearlImg.src = data.pearlImageUrl;
       
      } catch (error) {
        console.error("获取珍珠信息时出错:", error);
      }
    }, 1000); 
  });

  
  video.play().catch(() => {
    const btn = document.createElement("button");
    btn.textContent = "点击播放视频";
    Object.assign(btn.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      zIndex: "9999",
    });
    btn.onclick = () => {
      video.play();
      btn.remove();
    };
    document.body.appendChild(btn);
  });
});
