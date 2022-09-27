<template>
    <view>
        <header>
            <uni-search-bar focus="true" @input="input" :radius="30" placeholder="请输入搜索内容" cancelButton='none'>
            </uni-search-bar>
        </header>
        <!-- 搜索详情 -->
        <view class="search-list">
            <view class="search-item" v-for="(item,index) in searchResults" :key='index' @click="gotoDetail(item)">
                <view class="goods-name">
                    {{item.goods_name}}
                </view>
                <uni-icons type="arrowright" size="16"></uni-icons>
            </view>
        </view>
        <!-- 搜索历史 -->
        <view class="history-box" v-if="searchResults.length==0">
            <view class="history-title">
                <text>搜索历史</text>
                <uni-icons type="trash" size="17" @click="clean"></uni-icons>
            </view>
            <view class="history-list">
                <uni-tag v-for="(item,index) in history" :text="item" :key="index" class='uni-tag'
                    @click="gotoGoodslist(item)"></uni-tag>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                timer: null, //定时器
                value: '', //搜索框的值
                searchResults: [], //搜索的结果列表
                historyList: [], //搜索历史
            };
        },
        methods: {
            //input输入事件的函数
            input(e) {
                //启用防抖 
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.value = e
                    this.getSearchList()
                }, 500)

            },
            //获取搜索详情
            async getSearchList() {
                //判断用户是否输入为空
                if (this.value == "") {
                    return this.searchResults = []
                }
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/qsearch', {
                    query: this.value
                })
                if (res.meta.status != 200) uni.$showMsg
                this.searchResults = res.message
                this.saveSearchList()
                // console.log(this.searchResults);
            },
            //跳转到详情页
            gotoDetail(item) {
                console.log(item.goods_id);
                uni.navigateTo({
                    url: "/subpack/goods_detail/goods_detail?goods_id=" + item.goods_id
                })
            },
            //保存搜索历史
            saveSearchList() {
                //去重和添加
                const set = new Set(this.historyList)
                set.delete(this.value)
                set.add(this.value)
                this.historyList = Array.from(set)
                //将列表存储到本地
                uni.setStorageSync('history', this.historyList)
            },
            //清空历史记录
            clean() {
                this.historyList = []
                uni.clearStorageSync('history')
            },
            //跳转到商品列表页面
            gotoGoodslist(item) {
                uni.navigateTo({
                    url: "/subpack/good_list/good_list?query=" + item
                })
            }
        },
        computed: {
            //翻转历史记录 保持添加的在首位
            history() {
                return [...this.historyList].reverse()
            }
        },
        onLoad() {
            //页面初始化时获取历史记录的数据
            this.historyList = uni.getStorageSync('history') || []
        }
    }
</script>

<style lang="scss" scoped>
    header {
        background-color: #c00000;
        position: sticky;
        top: 0;
        z-index: 3;
    }

    .search-list {
        .search-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #efefef;
            padding: 20rpx 0 20rpx 10rpx;
            font-size: 12px;

            .goods-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 5px;
            }
        }
    }

    .history-box {
        padding: 0 5px;

        .history-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            font-size: 13px;
            border-bottom: 1px solid #efefef;
        }

        .history-list {
            display: flex;
            flex-wrap: wrap;

            .uni-tag {
                margin-top: 5px;
                margin-right: 5px;
            }
        }
    }
</style>
