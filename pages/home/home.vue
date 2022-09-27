<template>
    <view>
        <!-- 搜索框 -->
        <view class="search">
            <my-search @myclick="gotoSearch"></my-search>
        </view>
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" autoplay="true" :interval="2000" :duration="1000" circular>
            <swiper-item v-for="item in swiperList" :key='item.goods_id'>
                <navigator class="swiper-item" :url="'/subpack/goods_detail/goods_detail?goods_id='+item.goods_id">
                    <image :src="item.image_src"></image>
                </navigator>
            </swiper-item>
        </swiper>
        <!-- 导航栏区域 -->
        <view class="nav-list">
            <view class="nav-item" v-for="(item,index) in navList" :key='index' @click="navClickHandler(item)">
                <image :src="item.image_src" class="nav-img"></image>
            </view>
        </view>
        <!-- 主体的区域 -->
        <view class="floor-list">
            <view class="floor-item" v-for="(item,index) in mainList" :key="index">
                <image :src="item.floor_title.image_src" class="floor-title"></image>
                <view class="floor-image-box">
                    <navigator class="left-img-box" :url="item.product_list[0].url">
                        <image :src="item.product_list[0].image_src" mode="widthFix"
                            :style="{width:item.product_list[0].image_width+'rpx'}"></image>
                    </navigator>
                    <view class="right-img-box">
                        <navigator class="" v-for="(item2,i) in item.product_list" :key="i" v-if="i!=0"
                            :url="item2.url">
                            <image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}">
                            </image>
                        </navigator>
                    </view>
                </view>
            </view>
        </view>
    </view>

</template>

<script>
    
    export default {
      
        data() {
            return {
                swiperList: [], //轮播图的数据
                navList: [], //分类导航的数据
                mainList: [], //主体内容的数据
            };
        },
        methods: {
            //获取轮播图数据
            async getSwiperList() {
                const {
                    data: res
                } = await uni.$http.get("/api/public/v1/home/swiperdata")
                // console.log(res)
                if (res.meta.status != 200) {
                    return uni.$showMsg()
                } else {
                    this.swiperList = res.message
                }
            },
            //获取导航栏数据
            async getNavList() {
                const {
                    data: res
                } = await uni.$http.get("/api/public/v1/home/catitems")
                // console.log(res)
                if (res.meta.status != 200) {
                    return uni.$showMsg()
                } else {
                    this.navList = res.message
                }

            },
            //点击分类要跳转到分类的tabbar
            navClickHandler(item) {
                if (item.name == "分类") {
                    uni.switchTab({
                        url: "/pages/cate/cate"
                    })
                }
            },
            //获取主体内容数据
            async getMainList() {
                const {
                    data: res
                } = await uni.$http.get("/api/public/v1/home/floordata")
                if (res.meta.status != 200) {
                    return uni.$showMsg()
                } else {
                    res.message.forEach(floor => {
                        floor.product_list.forEach(goods => {
                            goods.url = '/subpack/good_list/good_list?' + goods.navigator_url.split(
                                "?")[1]
                        })
                    })
                    this.mainList = res.message
                    // console.log(this.mainList);
                }
            },
            //跳转到search页面
            gotoSearch() {
                uni.navigateTo({
                    url: "/subpack/search/search"
                })
            }
        },
        onLoad() {
            this.getSwiperList()
            this.getNavList()
            this.getMainList()
        }

    }
</script>

<style lang="scss" scoped>
    .search {
        position: sticky;
        top: 0;
        z-index: 3;
    }

    swiper {
        height: 330rpx;

        .swiper-item {
            width: 100%;
            height: 100%;

            image {
                width: 100%;
                height: 100%;
            }
        }
    }

    .nav-list {
        margin: 30rpx 0;
        display: flex;
        justify-content: space-around;

        .nav-img {
            width: 128rpx;
            height: 128rpx;
        }
    }

    .floor-list {
        .floor-title {
            height: 60rpx;
            width: 100%;
            display: flex;
        }

        .floor-image-box {
            display: flex;
            padding-left: 10rpx;

            .right-img-box {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;

                view {
                    height: 50%;
                }
            }
        }
    }
</style>
