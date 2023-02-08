<template>
  <!-- 这里是search模块 -->
  <!-- 因为已经注册了全局组件（main.js中，所以这里不需要引入组件 -->
  <div>
    <TypeNav></TypeNav>
    <div class="main">
      <div class="py-container">
        <!--bread面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCateogoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keywords">
              {{ searchParams.keywords }}<i @click="removeKeywords">×</i>
            </li>
            <!-- 品牌名的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 产品参数的面包屑 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector
          @trademarkInfo="trademarkInfo"
          @attrInfo="attrInfo"
          @getPageNo="getPageNo"
        />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder(1)">
                  <a href="#"
                    >综合<span
                      v-show="isOne"
                      class="iconfont"
                      :class="{ 'icon-upload': isAsc, 'icon-down': isDesc }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder(2)">
                  <a href="#"
                    >价格<span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{ 'icon-upload': isAsc, 'icon-down': isDesc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >Apple苹果iPhone 6s (A1699)Apple苹果iPhone 6s
                      (A1699)Apple苹果iPhone 6s (A1699)Apple苹果iPhone 6s
                      (A1699)</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";

export default {
  name: "Search",
  data() {
    return {
      // 带给服务器发送请求的筛选参数
      searchParams: {
        //一级分类的ID
        category1Id: "",
        //二级分类的ID
        category2Id: "",
        //三级分类的ID
        category3Id: "",
        //商品分类名字（一级分类）
        categoryName: "",
        //搜索关键字
        keywords: "",
        //排序规则 默认为综合降序 1: 综合,2: 价格 asc: 升序,desc: 降序
        order: "1:desc",
        //当前页码
        pageNo: 1,
        //当前页面显示数据数量
        pageSize: 3,
        //售卖商品属性参数
        props: [],
        //一级大类下各个手机的品牌
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  beforeMount() {
    //在挂载前，更新即将向服务器发送请求的标签数据
    //复杂写法
    // this.searchParams.category1Id = this.$route.query.category1Id
    // this.searchParams.category2Id = this.$route.query.category2Id
    // this.searchParams.category3Id = this.$route.query.category3Id
    // this.searchParams.keyword = this.$route.params.keyword
    //简单写法(合并对象)
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    console.log(this.searchParams);
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["goodsList", "attrsList", "trademarkList"]),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
      //不存在-1表示order中有1，即为综合条件下筛选
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
      // 有2时为价格条件下筛选
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
  },
  methods: {
    getData() {
      this.$store.dispatch("getGetSearchInfo", this.searchParams);
    },
    removeCateogoryName() {
      //用户关闭某项标签，需要重新整合参数、路径、并向服务器发送请求
      //如果是''则依然会向服务器发送，如果是undefined则不会发送该属性，节约宽带
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      //地址栏也需要修改
      //如果当前路由存在params数据（关键字），则需要保存
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    removeKeywords() {
      this.searchParams.keywords = undefined;
      this.getData();
      //关掉面包屑记得也要同步关掉用户输入的文字内容，这个是在那个搜索框里面
      this.$bus.$emit("clear");
      //如果当前路由存在query数据（用户在搜索栏输入的数据），需要保存
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    trademarkInfo(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getData();
    },
    removeTrademark() {
      this.searchParams.trademark = "";
      this.getData();
    },
    attrInfo(attr, attrValue) {
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //数组去重
      if (this.searchParams.props.indexOf(props) == -1)
        this.searchParams.props.push(props);
      this.getData();
    },
    removeAttr(index) {
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    //排序操作
    changeOrder(flag) {
      let originOrder = this.searchParams.order;
      // 获得此时点的是哪一个
      let originFlag = this.searchParams.order.split(":")[0];
      // 获得此时点的是升序还是降序
      let originSort = this.searchParams.order.split(":")[1];

      console.log(originFlag, originSort);
      //准备一个新的order值
      let newOrder = "";
      //如果点击的和已有的相同，则改变升降序
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSort == "desc" ? "asc" : "desc"}`;
      } else {
        //如果点击的和已选中的不同，则改变点的状态，并且默认为降序
        newOrder = `${flag}:${"desc"}`;
      }
      this.searchParams.order = newOrder;
      console.log(newOrder);

      this.getData();
    },
    getPageNo(pageNo) {
      console.log(pageNo);
      this.searchParams.pageNo = pageNo;
      this.getData();
    },
  },
  watch: {
    //监视路由内的信息是否发生变化，如果发生变化，需要再次发起请求
    $route(newValue, oldValue) {
      //在每一次数据更新请求之前，需要把上一次的残留数据先清空
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
      //清空上次历史数据，再更新新数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params);

      this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>