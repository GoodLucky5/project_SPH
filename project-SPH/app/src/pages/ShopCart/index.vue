<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart, index) in cartInfoList"
          :key="cart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="updateCheckedById(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('-', -1, cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('+', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck && cartInfoList.length>0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteCheckedShopCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$store.dispatch("getCartList");
    },
    //购物车数量操作 防止用户点击过快需要进行节流处理
    handler: throttle(async function (type, disNum, cart) {
      switch (type) {
        case "+":
          disNum = 1;
          break;
        case "-":
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            disNum = parseInt(disNum) - cart.skuNum;
          }
      }
      //确定数量应该如何操作后派发
      try {
        await this.$store.dispatch("reqAddOrUpdateShopCart", {
          skuId: cart.skuId,
          //这里只传递变化的数字是提前和后台老师商量好的，通过reqAddOrUpdateShopCart这个接口是可以实现得到
          skuNum: disNum,
        });
        this.getData();
      } catch (error) {}
    }, 1000),
    // async handler(type, disNum, cart) {
    //   //type:为了区分点的是+ 还是 - 还是 直接修改了数据
    //   //disNum:需要向服务器提交的变化量：点了+ 就是+1 ，点了-就是减1，直接修改数据需要取新数据和旧数据的差值
    //   //cart ：为了区分修改的是哪一个商品的数据
    //   switch (type) {
    //     case "+":
    //       disNum = 1;
    //       break;
    //     case "-":
    //       disNum = cart.skuNum > 1 ? -1 : 0;
    //       break;
    //     case "change":
    //       if (isNaN(disNum) || disNum < 1) {
    //         disNum = 0;
    //       } else {
    //         disNum = parseInt(disNum) - cart.skuNum;
    //       }
    //   }
    //   //确定数量应该如何操作后派发
    //   try {
    //     await this.$store.dispatch("reqAddOrUpdateShopCart", {
    //       skuId: cart.skuId,
    //       //这里只传递变化的数字是提前和后台老师商量好的，通过reqAddOrUpdateShopCart这个接口是可以实现得到
    //       skuNum: disNum,
    //     });
    //     this.getData();
    //   } catch (error) {}
    // },
    //删除购物车
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch("reqDeleteCartById", cart.skuId);
        //注意这里已经向服务器申请删除对应的数据，所以再次申请返回的数据里面就没有被删除的选项了
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //更新商品选中状态
    async updateCheckedById(cart, event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("changeCartCheckedById", {
          skuId: cart.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        console.log(error.message);
      }
    },
    //删除选中状态的商品
    async deleteCheckedShopCart() {
      try {
        await this.$store.dispatch("deleteCheckedShopCart");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改全部产品的选中状态
    async updateAllCartChecked(event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updateAllCartChecked", isChecked);
        this.getData();
      } catch (error) {
        alert(error.message)
      }
    },
  },
  computed: {
    ...mapGetters(["cartList"]),
    //购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //计算购买产品的总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.skuPrice;
      });
      return sum;
    },
    //判断底部复选框是否全选
    isAllCheck() {
      //遍历出有一个不符合回调函数的随机停止遍历并返回false
      //注意下面回调是箭头函数的省略写法，省略return
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }
        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>