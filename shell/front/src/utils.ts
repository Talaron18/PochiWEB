
async function subitUserID(){
    const username=(document.getElementById("username") as HTMLInputElement | null)?.value ?? "";
    await fetch(`http://shell.kenxu.top/${username}/pearl.jpg`)
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('网络连接失败');
        })
        .then(imageBlob => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(imageBlob);
            img.id="pearlImage";
            document.body.appendChild(img);
        })
        .catch(error => {
            console.error('获取图像失败：', error);
        });

    await fetch(`http://shell.kenxu.top/${username}/text`)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('网络连接失败');
        })
        .then(textData => {
            const p = document.createElement('p');
            p.textContent = textData;
            p.id="pearlText";
            document.body.appendChild(p);
        })
        .catch(error => {
            console.error('获取文本失败：', error);
        });
}

