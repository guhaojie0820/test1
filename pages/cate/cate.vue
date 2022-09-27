<template>
    <view>
        <my-search @myclick="gotoSearch"></my-search>
        <view class="scroll-view-container" >
            <!-- 左侧的滑动区域 -->
            <scroll-view scroll-y="true" :style="{height: WidthInfo}" class="left-scroll">
                <block v-for="(item,index) in cateList" :key="index">
                    <view :class="['left-scroll-item',index==active?'active':'']" @click="activeChange(index)">
                        {{item.cat_name}}
                    </view>
                </block>
            </scroll-view>
            <!-- 右侧的滑动区域 -->
            <scroll-view scroll-y="true" :style="{height: WidthInfo}" class="right-scroll" :scroll-top="scrollTop">
                <view class="cate-lv2" v-for="(item,index) in childLevel2" :key="index">
                    <!-- 标题 -->
                    <view class="cate-lv2-title">
                        /{{item.cat_name}}/
                    </view>
                    <!-- 标题下内容 -->
                    <view class="cate-lv3-list">
                        <view class="cate-lv3-item" v-for="(item2,index2) in item.children" :key="index2" @click="gotoGoodsdetail(item2)">
                            <image :src="item2.cat_icon" mode=""></image>
                            <text>{{item2.cat_name}}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                active: 0, //选中状态的索引
                WidthInfo: 0, //当前设置的可视区域的高度
                cateList: [], //左侧分类的数据
                childLevel2: [], //二级分类
                scrollTop:0,//距离顶部的值
            };
        },
        onLoad() {
            this.WidthInfo = uni.getSystemInfoSync().windowHeight - 50+ "px"
            this.getCateList()
        },
        methods: {
            //获取左侧栏数据
            async getCateList() {
                const {
                    data: res
                } = await uni.$http.get("/api/public/v1/categories")
                // console.log(res);
                if (res.meta.status != 200) return uni.$showMsg()
                this.cateList = res.message
                //默认状态下二级分类的数据
                this.childLevel2 = res.message[0].children
            },
            //切换点击的状态
            activeChange(index) {
                this.active = index
                //根据点击分类 获取不同分类的二级分类
                this.childLevel2 = this.cateList[index].children
                //切换分类是重置到顶部的距离
                this.scrollTop = this.scrollTop==0? 1:0
            },
            //三级分类的页面跳转
            gotoGoodsdetail(value){
                uni.navigateTo({
                    url:"/subpack/good_list/good_list?cid=" +value.cat_id
                })
            },
            //跳转到search页面
            gotoSearch(){
                uni.navigateTo({
                    url:"/subpack/search/search"
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .scroll-view-container {
        display: flex;

        .left-scroll {
            width: 120px;

            .left-scroll-item {
                background-color: #f7f7f7;
                line-height: 60px;
                text-align: center;
                font-size: 12px;
                position: relative;

                &.active {
                    background-color: #fff;

                    &::before {
                        content: "";
                        display: block;
                        width: 3px;
                        height: 30px;
                        background-color: #c00000;
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                    }
                }
            }

        }

        .right-scroll {
            .cate-lv2 {
                .cate-lv2-title {
                    text-align: center;
                    font-size: 12px;
                    padding: 15px 0;
                    font-weight: bold;
                }

                .cate-lv3-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    .cate-lv3-item {
                        width: 33.33%;
                        display: flex;
                        flex-flow: column;
                        justify-content: center;
                        align-items: center;
                        margin-bottom:10rpx ;
                        image {
                            width: 60px;
                            height: 60px;
                        }

                        text {
                            font-size: 12px;
                          
                        }
                    }
                }
            }
        }

    }
</style>
