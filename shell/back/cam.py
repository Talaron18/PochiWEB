import cv2
esp32_ip=""
stream_url=f"http://{esp32_ip}/stream"
video=cv2.VideoCapture(stream_url)
if not video.isOpened():
    print("Error: Could not open video stream.")
    exit()

while True:
    ret,frame=video.read()
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    thres=cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,11,2)
    