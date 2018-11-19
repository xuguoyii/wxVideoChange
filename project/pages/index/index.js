//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        page: 1,//无限下拉分页
        videoData: [{
            video: "",
            image: "http://img.zcool.cn/community/01219159455828a8012193a3408af8.jpg@3000w_1l_2o_100sh.jpg"
        }, {
            video: "",
            image: "http://img.zcool.cn/community/01fe5257a1997d0000018c1bf192ee.jpg@2o.jpg"
        }, {
            video: "",
            image: "http://img.zcool.cn/community/0191db57f52c52a84a0e282be8bf87.jpg@2o.jpg"
        }], //视频资源，包括视频地址和视频的图片
        videoSrc: '', //当前视频的地址
        ty:0, //手指开始触摸时的位置
        idx: 0, //当前视频索引
        scrollTop:0, //用来隐藏video 标签
        scrollStart:'', //滚动动画
        totalNum:10, //视频总数，用来加载更多
        height:0, //设备高度
    },

    onLoad: function () {
        const that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                })
            }
        })
        this.animation = wx.createAnimation();//可根据文档，获得满足自己需求的实例
        this.video = wx.createVideoContext('myVideo');
    },
    /**
     * 开始触摸
     * @param e
     */
    onTouchStart: function (e) {
        let tp = e.changedTouches[0]; //记录手指位置
        this.setData({
            ty:tp.y
        })
    },
    /**
     * 手指离开
     * @param e
     */
    onTouchEnd: function (e) {
        this.video.stop(); //停止当前视频
        let {
            ty,
            idx,
            videoData,
            totalNum,
            page
        } = this.data;
        let tp = e.changedTouches[0]; //手指结束时位置
        if(tp.y - ty<- 100){  //向下滚动时的处理 -100为触发条件，可写在data中，统一处理
            this.setData({
                scrollTop:1, //更改这个值为了隐藏video显示image，开始动画
            })
            idx += 1;
            if(idx+1>=totalNum){ //当滑到倒数第二个视频时，开始请求数据
                this.setData({
                    page: page+1,
                    totalNum: totalNum+totalNum,
                    videoData: videoData.concat(videoData) //此时可以调用请求视频列表的方法，例如this.getVideoList(),y由于没有接口支持，模拟无限加载的效果
                })


            }
            this.animation.translateY(-idx*this.data.height).step(); //创建动画
        } else if(tp.y - ty>100&&idx>0){ //向上滚动的判断，要区分是否将滚到第一个视频，添加不同动画
            idx -= 1;
            this.setData({
                scrollTop:1,
            })
            // this.animation.top(-idx*100-100+'vh').step()
            if(idx==0){
                this.animation.translateY(-this.data.height).step()
            } else {
                this.animation.translateY(-idx*this.data.height).step()
            }
        }else if(tp.y - ty>100&&idx==0){ //已经是第一个视频的时候的提示
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            })
        } else if(tp.y - ty<- 100&&idx>totalNum-2){ //之前预留的到底提示，后不需要所以未加

        }
        this.setData({
            idx: idx,
            videoSrc: videoData[idx].video,
            video: videoData[idx],
            tx:tp.x,
            ty:tp.y,
            scrollStart: this.animation.export()
        })
        setTimeout(()=>{
            this.setData({
            scrollTop: 0
            })
            this.video.play()
        },1300); //1.3秒后显示video标签，播放视频，可根据实际情况调整
    },


})
