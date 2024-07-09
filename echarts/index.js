window.addEventListener('load',() => {
    const timeSpan = document.querySelector('.showTime span');

    setTime()
    const timeID = setInterval(setTime, 1000)
    function setTime() {
        // 获取当前时间对象
        const now = new Date();
        const fullYear = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        // 返回格式字符串！，并且设置
        timeSpan.innerHTML = `${fullYear}年${month}月${date}日-${hours}时${minutes}分${seconds}秒`
        // console.log(timeSpan)
    }

    window.addEventListener('Beforeunload',() => {
        clearInterval(timeID)
    })
})
