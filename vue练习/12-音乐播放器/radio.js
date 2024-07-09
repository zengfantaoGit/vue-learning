const vm = new Vue({
    el: '#root',
    data() {
        return {
            show: true,
            point: 0,
            // 歌单持续时间
            duration: 0,
            // 播放时间
            arriveTime: 0,
            // 歌单列表
            singList: [],
            // 评论列表
            commentList: [],
            // 选中播放音乐的url地址
            musicUrl: null,
            // 选中的图片地址
            imgUrl: null,
            // 搜索名称
            checkName: '',
            // 播放音乐的下标，刚开始默认没有歌曲
            index: -1,
            // 控制评论的偏移量
            offsetComments: 0,
            // 控制搜索歌曲的偏移量
            offsetSing: 0
        }
    },
    methods: {
        // audio的js对象内部封装了 play()与pause()方法来控制audio标签的播放
        play() {
            // console.dir(this.$refs.audio)
            this.$refs.audio.play()
            this.arrTime()
            // 开启定时器，每一秒后就要添加进度
            this.id = setInterval(this.arrTime, 1000)
            /*图片开始旋转*/
            this.$refs.imgRotate.style.animationPlayState = 'running'
            this.show = false
        },
        paused() {
            this.$refs.audio.pause()
            // 关闭定时器
            clearInterval(this.id)
            /*图片不旋转*/
            this.$refs.imgRotate.style.animationPlayState = 'paused'
            this.show = true
        },
        // 手动调播放条时的音乐进度切换
        change() {
            const pointSend = this.point * this.$refs.audio.duration / 360
            this.$refs.audio.currentTime = pointSend
            // 每次调整播放器就重新播放
            clearInterval(this.id)
            this.play()
        },
        // 每过一秒就要调整point变量
        arrTime() {
            // 增加一秒
            this.arriveTime = this.$refs.audio.currentTime
            this.point = 1 / this.$refs.audio.duration * 360 * this.arriveTime
        },
        minuteToString(time) {
            // console.log(time)
            const secondInt = Math.floor(time % 60)
            second = secondInt >= 10 ? `${secondInt}` : `0${secondInt}`
            minute = Math.floor(time / 60)
            return minute + ':' + second
        },
        // 切换第index条音乐播放
        Listen(index) {
            this.offsetComments = 0
            this.index = index
            // this.musicUrl = this.singUrlList[index]
            // this.imgUrl = this.imgUrlList[index]
        },
        // 根据关键词搜索音乐名
        async searchSing(checkName) {
            console.log(checkName)
            // 这个接口可以直接访问网易云的搜索接口，默认20条歌单
            axios.get(`https://autumnfish.cn/search?keywords=${checkName}&limit=10&offset=${this.offsetSing * 10}`).then((resp) => {
                // console.log(resp.data.result.songs)
                this.singList = resp.data.result.songs || []
            },error => {
                console.log(error)
            })
        },
        // 对应歌曲评论，默认10条，从offsetComments * 10 取启动，从0开始计数
        async searchComments() {
            axios.get(`https://autumnfish.cn/comment/hot?id=${this.singList[this.index].id}&limit=10&type=0&offset=${this.offsetComments * 10}`).then((resp) => {
                // console.log(resp)
                const {data: {hotComments}} = resp
                // console.log(hotComments)
                // 获取热门评论信息
                this.commentList = hotComments || []
            })
        }
    },
    watch: {
        // 监测时长变化
        point() {
            // 当音乐播放结束时
            if (this.point >= 360) {
                // 清除定时器
                clearInterval(this.id)
                // 从0开始计数
                this.point = 0
                if (this.$refs.audio.loop) {
                    // 重新播放
                    this.play()
                } else {
                    // 停止播放
                    this.paused()
                }
            }
        },
        // 音乐切换到第newIndex音乐时，更新最长播放时间
        async index(newIndex) {
            // TODO 音乐地址与封面获取，与提取音乐是异步关系，容易出现还未获取音乐就会播放的错误
            await axios.get(`https://autumnfish.cn/song/url?id=${this.singList[newIndex].id}`).then((resp) => {
                // 解构赋值获取歌曲的url地址
                // console.log(resp)
                const {data: {data: [{url}, ...a]}} = resp
                this.$refs.audio.src = url
                console.log(url)
                // console.log(this.$refs.audio.src)
            })

            // 获取音乐详细信息的api接口
            await axios.get(`https://autumnfish.cn/song/detail/?ids=${this.singList[newIndex].id}`).then((resp) => {
                // 对象与数组的解构赋值获取picUrl
                const {data: {songs: [{al: {picUrl}}]}} = resp
                this.imgUrl = picUrl
                console.log(picUrl)
            })

            await this.searchComments()

            // 使用本地音乐时，需要使用异步防止dom元素未加载被错过，同时play方法属于异步方法，需要延迟播放防止还未获取歌曲就使用play方法
            const id = setInterval(() => {
                if (isNaN(this.$refs.audio.duration)) {
                    console.log(1)
                } else {
                    // 切换时间
                    const audio = this.$refs.audio
                    this.duration = audio.duration
                    // 新的歌曲播放时长清零
                    audio.currentTime = 0
                    // 重新播放
                    this.play()
                    // console.dir(this.$refs.audio)
                    clearInterval(id)
                }
            }, 0)
        },
        // 检测评论偏移量的变化
        async offsetComments() {
            // 重新搜索歌词
            await this.searchComments()
        },
        // 检测歌曲偏移量的变化
        async offsetSing() {
            // 重新搜索歌曲
            await  this.searchSing(this.checkName)
        }
    },
    computed: {
        durationToString() {
            return this.minuteToString(this.duration)
        },
        arriveTimeToString() {
            return this.minuteToString(this.arriveTime)
        },
        singUrlList() {
            return this.singList.map((item) => {
                return `./assets/${item.name}.mp3`
            })
        },
        imgUrlList() {
            // 返回每张图片路径
            return this.singList.map((item) => {
                return `./imgs/${item.name}.jpg`
            })
        }
    }
})