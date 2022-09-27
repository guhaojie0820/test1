<template>
    <view v-if="goodsinfo.goods_name">
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500" :circular="true">
            <swiper-item v-for="(item, i) in goodsinfo.pics" :key="i" @click="preview(i)">
                <image :src="item.pics_big"></image>
            </swiper-item>
        </swiper>
        <!-- 商品信息区域 -->
        <view class="goods-info-box">
            <!-- 商品价格 -->
            <view class="price">￥{{goodsinfo.goods_price}}</view>
            <!-- 信息主体区域 -->
            <view class="goods-info-body">
                <!-- 商品名称 -->
                <view class="goods-name">{{goodsinfo.goods_name}}</view>
                <!-- 收藏 -->
                <view class="favi">
                    <uni-icons type="star" size="18" color="gray"></uni-icons>
                    <text>收藏</text>
                </view>
            </view>
            <!-- 运费 -->
            <view class="yf">快递：免运费</view>
        </view>
        <rich-text :nodes="goodsinfo.goods_introduce"></rich-text>
        <view class="goods_nav">
            <!-- fill 控制右侧按钮的样式 -->
            <!-- options 左侧按钮的配置项 -->
            <!-- buttonGroup 右侧按钮的配置项 -->
            <!-- click 左侧按钮的点击事件处理函数 -->
            <!-- buttonClick 右侧按钮的点击事件处理函数 -->
            <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="Onclick"
                @buttonClick="buttonClick" />
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations,
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                goodsinfo: {},
                // 左侧按钮组的配置对象
                // 左侧按钮组的配置对象
                options: [{
                    icon: 'shop',
                    text: '店铺'
                }, {
                    icon: 'cart',
                    text: '购物车',
                    info: 2
                }],
                // 右侧按钮组的配置对象
                buttonGroup: [{
                        text: '加入购物车',
                        backgroundColor: '#ff0000',
                        color: '#fff'
                    },
                    {
                        text: '立即购买',
                        backgroundColor: '#ffa200',
                        color: '#fff'
                    }
                ]
            };
        },
        computed: {
            ...mapState('m_cart', ['cart']),
            // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
            ...mapGetters('m_cart', ['total']),
        },
        watch: {
            // 监听 total 值的变化，通过第一个形参得到变化后的新值
            total: {
                handler(newVal) {
                    // 通过数组的 find() 方法，找到购物车按钮的配置对象
                    const findResult = this.options.find((x) => x.text === '购物车')
                    if (findResult) {
                        // 动态为购物车按钮的 info 属性赋值
                        findResult.info = newVal
                    }
                },
                immediate: true
            }
        },
        onLoad(options) {
            // console.log(options);
            const goods_id = options.goods_id
            this.getGoodsInfo(goods_id)

        },
        methods: {
            //获取详情数据
            async getGoodsInfo(goods_id) {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/goods/detail', {
                    goods_id
                })
                // console.log(res);
                if (res.meta.status != 200) return uni.$showMsg
                // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题  将 webp 的后缀名替换为 jpg 的后缀名 解决 .webp 格式图片在 ios 设备上无法正常显示的问题：
                res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
                    '<img style="display:block;" ').replace(/webp/g, 'jpg')
                this.goodsinfo = res.message
                // console.log(this.goodsinfo);
            },
            //实现预览效果
            preview(i) {
                uni.previewImage({
                    // 预览时，默认显示图片的索引
                    current: i,
                    // 所有图片 url 地址的数组
                    urls: this.goodsinfo.pics.map(x => x.pics_big)
                })
            },
            //左侧点击事件
            Onclick(e) {
                // console.log(e);
                //点击跳转至购物车tabbar
                if (e.content.text == "购物车") {
                    uni.switchTab({
                        url: '/pages/cart/cart'
                    })
                }
            },
            //右侧点击事件
            buttonClick(e) {
                // console.log(e);
                //判断是否点击了加入购物车
                if (e.content.text === '加入购物车') {
                    //  组织一个商品的信息对象
                    const goods = {
                        goods_id: this.goodsinfo.goods_id, // 商品的Id
                        goods_name: this.goodsinfo.goods_name, // 商品的名称
                        goods_price: this.goodsinfo.goods_price, // 商品的价格
                        goods_count: 1, // 商品的数量
                        goods_small_logo: this.goodsinfo.goods_small_logo, // 商品的图片
                        goods_state: true // 商品的勾选状态
                    }
                    //将数据存储到vuex中
                    this.addToCart(goods)
                }
            },
            // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
            ...mapMutations('m_cart', ['addToCart'])
        }
    }
</script>

<style lang="scss" scoped>
    swiper {
        height: 750rpx;

        image {
            width: 100%;
            height: 100%;
        }
    }

    // 商品信息区域的样式
    .goods-info-box {
        padding: 10px;
        padding-right: 0;

        .price {
            color: #c00000;
            font-size: 18px;
            margin: 10px 0;
        }

        .goods-info-body {
            display: flex;
            justify-content: space-between;

            .goods-name {
                font-size: 13px;
                padding-right: 10px;
            }

            // 收藏区域
            .favi {
                width: 120px;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-left: 1px solid #efefef;
                color: gray;
            }
        }

        // 运费
        .yf {
            margin: 10px 0;
            font-size: 12px;
            color: gray;
        }

    }

    .goods-detail-container {
        // 给页面外层的容器，添加 50px 的内padding，
        // 防止页面内容被底部的商品导航组件遮盖
        padding-bottom: 50px;
    }

    .goods_nav {
        // 为商品导航组件添加固定定位
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
</style>
