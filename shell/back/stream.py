import socket
import threading
import time
import numpy as np
import cv2
import os

begin_data = b'Frame Begin'
end_data = b'Frame Over'

#接收数据
# ESP32发送一张照片的流程
# 先发送Frame Begin 表示开始发送图片 然后将图片数据分包发送 每次发送1430 余数最后发送
# 完毕后发送结束标志 Frame Over 表示一张图片发送完毕
# 1430 来自ESP32cam发送的一个包大小为1430 接收到数据 data格式为b''
def handle_sock(sock, addr):
    temp_data = b''
    t1 = int(round(time.time() * 1000))
    while True:
        data = sock.recv(1430)
        print("接收到的数据包大小：" + str(len(data)))
        # 如果这一帧数据包的开头是 b'Frame Begin' 则是一张图片的开始
        if data[0:len(begin_data)] == begin_data:
            # 将这一帧数据包的开始标志信息（b'Frame Begin'）清除   因为他不属于图片数据
            data = data[len(begin_data):len(data)]
            # 判断这一帧数据流是不是最后一个帧 最后一针数据的结尾时b'Frame Over'
            while data[-len(end_data):] != end_data:
                temp_data = temp_data + data  # 不是结束的包 讲数据添加进temp_data
                data = sock.recv(1430)# 继续接受数据 直到接受的数据包包含b'Frame Over' 表示是这张图片的最后一针
            # 判断为最后一个包 将数据去除 结束标志信息 b'Frame Over'
            temp_data = temp_data + data[0:(len(data) - len(end_data))]  # 将多余的（\r\nFrame Over）去掉 其他放入temp_data
            # 显示图片
            receive_data = np.frombuffer(temp_data, dtype='uint8')  # 将获取到的字符流数据转换成1维数组
            print("转换后的数据大小：" + str(len(receive_data)))
            r_img = cv2.imdecode(receive_data, cv2.IMREAD_COLOR)  # 将数组解码成图像
            # r_img = r_img.reshape(480, 640, 3)
            # r_img = r_img.reshape(320, 240, 3)
            t2 = int(round(time.time() * 1000))
            fps = 1000//(t2-t1)
            cv2.putText(r_img, "FPS" + str(fps), (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
            t=time.strftime("%Y%m%d%H%M%S", time.localtime())
            outdir=f"/home/main/temp"
            name=f"{t}.jpg"
            outpath=os.path.join(outdir,name)
            os.makedirs(outdir, exist_ok=True)
            cv2.imwrite(outpath, r_img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            t1 = t2
            print("接收到的数据包大小：" + str(len(temp_data)))  # 显示该张照片数据大小
            temp_data = b''  # 清空数据 便于下一章照片使用

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 这里的 ip 与端口是运行该程序的服务器的 ip 与端口，需要与 arduino 中的一致
server.bind(('0.0.0.0', 36355))
server.listen(5)
CONNECTION_LIST = []

#主线程循环接收客户端连接
while True:
    sock, addr = server.accept()
    CONNECTION_LIST.append(sock)
    print('Connect--{}'.format(addr))
    #连接成功后开一个线程用于处理客户端
    client_thread = threading.Thread(target=handle_sock, args=(sock, addr))
    client_thread.start()