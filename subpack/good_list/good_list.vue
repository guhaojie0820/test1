<template>
    <view>
        <view class="goods-list">
            <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
                <my-goods :goods="item"></my-goods>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                //请求参数
                queryobj: {
                    query: '', //查询的关键词
                    cid: "", //分类id
                    pagenum: 1, //页面索引
                    pagesize: 8, //每页的长度
                },
                goodsList: [], //获取到的商品列表的数据
                isloading: false, // 是否正在请求数据
                Total: 0, //总条数
            };
        },
        onLoad(options) {
            this.queryobj.query = options.query || ""
            this.queryobj.cid = options.cid || ""
            this.getGoodsList()
        },
        methods: {
            async getGoodsList(callback) {
                this.isloading = true
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/search', this.queryobj)
                // 只要数据请求完毕，就立即按需调用 cb 回调函数
                // console.log(res);
                callback && callback()
                this.isloading = false
                if (res.meta.status != 200) return uni.$showMsg
                this.Total = res.message.Total
                this.goodsList = [...this.goodsList, ...res.message.goods]
            },
            //跳转到详情页面
            gotoDetail(item) {
                uni.navigateTo({
                    url: "/subpack/goods_detail/goods_detail?goods_id=" + item.goods_id
                })
                // console.log(item);
            }
        },
        //上拉触底事件
        onReachBottom() {
            //判断是否以及全部请求完毕
            if (this.queryobj.pagenum * this.queryobj.pagesize >= this.Total) return uni.$showMsg('数据加载完毕！')
            if (this.isloading) return
            //让页码值自增加1
            this.queryobj.pagenum++
            this.getGoodsList()
        },
        //下拉刷新事件
        onPullDownRefresh() {
            //重置所有的关键词
            this.queryobj.pagenum = 1
            this.Total = 0
            this.isloading = false
            this.goodsList = []
            //重新发起请求
            this.getGoodsList(() => {
                uni.stopPullDownRefresh()
            })
        }
    }
</script>

<style lang="scss" scoped>
</style>
