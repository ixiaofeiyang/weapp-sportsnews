const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');

Page({
    data: {
        swiper: {},
        special: {},
        news: {},
        loading: true,
        hasMore: true,
        subtitle: '',
        scrollTop: 0,
        showGoTop: false,
        showSearch: true,
    },
    showLoading() {
        wx.showNavigationBarLoading();
        this.setData({
            subtitle: '加载中...',
            loading: true
        });
    },
    hideLoading() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
            loading: false
        });
    },
    /**
     * [initLoad 初始化加载数据]
     * @return {[type]} [description]
     */
    initLoad() {
        this.showLoading();
        newsdata.find('ClientNews', {
                id: 'TY43,FOCUSTY43,TYTOPIC',
                page: 1
            })
            .then(d => {
                d.forEach((obj, index) => {
                    let validData = obj.item;
                    if (!validData)
                        return;
                    let typeData = obj.type;
                    if (typeData == 'focus') { //首页轮播图
                        this.setData({
                            swiper: obj,
                        });
                    } else if (typeData == 'tytopic') { //首页专题导航
                        this.setData({
                            special: obj,
                        });
                    } else if (typeData == 'list') { //首页新闻列表
                        this.setData({
                            news: obj,
                        });
                    }
                    this.hideLoading();
                })
            })
            .catch(e => {
                console.error(e)
                this.setData({
                    movies: [],
                })
                this.hideLoading();
            })
            
    },

    /**
     * [loadMore 加载更多数据]
     * @return {[type]} [description]
     */
    loadMore() {
        this.showLoading();
        let currentPage = this.data.news.currentPage;
        if (currentPage >= this.data.news.totalPage) {
            this.setData({
                hasMore: false,
            });
            return;
        }
        newsdata.find('ClientNews', {
                id: 'TY43',
                page: ++currentPage
            })
            .then(d => {
                let newnews = d[0];

                let olditem = this.data.news.item;
                newnews.item = olditem.concat(newnews.item);
                this.setData({
                    news: newnews,
                });
                this.hideLoading();
            })
            .catch(e => {
                this.setData({
                    subtitle: '获取数据异常',
                })
                console.error(e);
                this.hideLoading();
            })
           
    },
    navToSpecial(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../special-page/special-page' + str ,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToPicture(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../picture-page/picture-page' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToArticle(event) {
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../article-page/article-page' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToVideo(event) {
        let str = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../video-page/video-page?videoUrl=' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    navToDocLive(event) {
        let str = JSON.stringify(event.currentTarget.dataset.liveext);
        wx.navigateTo({
            url: '../doclive-page/doclive-page?option=' + str,
            success: (res) => {},
            fail: (err) => {
                console.log(err)
            }
        });
    },
    toTop() {
        console.log(111)
    },
    searchBtn() {
        this.setData({
            showSearch: false,
        });    
    },
    ensureBtn() {
        this.setData({
            showSearch: true,
        }); 
    },
    scroll(event) {
        this.setData({
            showSearch: true,
        }); 
    },
    /**
     * [onLoad 载入页面时执行的生命周期初始函数]
     * @return {[type]} [description]
     */
    onLoad() {
        this.initLoad();
    },

    /**
     * [onPullDownRefresh 下拉刷新数据]
     * @return {[type]} [description]
     */
    onPullDownRefresh() {
        this.initLoad();
    },

    /**
     * [onReachBottom 上拉加载更多]
     * @return {[type]} [description]
     */
    onReachBottom() {
        this.loadMore();
    }
})