// video.html 逻辑：播放完视频后跳转到结果页
const video = document.getElementById("pearl-video") as HTMLVideoElement;
const params = new URLSearchParams(window.location.search);
const username = params.get("username") || "访客";

video.addEventListener("ended", (): void => {
  const pearlId = Date.now().toString();
  window.location.href = `result.html?username=${encodeURIComponent(username)}&id=${pearlId}`;
});
