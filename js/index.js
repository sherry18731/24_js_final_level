
let productData = [];
let cartData = [];

const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCart-tableList");
const discardAllBtn = document.querySelector(".discardAllBtn");


// 初始化資料
function init(){
    getProductList();
    getCartList()
}
init();

// 取得產品資訊
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(res){
        productData = res.data.products;
        renderProduct()
    })
}

// 消除重複(產品li字串)
function combineProductHTMLItem(item){
    return `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img src="${item.images}"
              alt="">
          <a href="#" class="addCardBtn js-addCart" data-id="${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
      </li>`
}

// 渲染產品畫面
function renderProduct(){
    let str = "";
    productData.forEach(function(item){
        str += combineProductHTMLItem(item)
    })
    productList.innerHTML = str;
}

//  下拉選單篩選
//  選全部的時候不會渲染畫面
productSelect.addEventListener('change',function(e){
    const category = e.target.value;
    if(category == "全部"){
        console.log("all")
        renderProduct()
    }
    let str = "";
    productData.forEach(function(item){
        if(item.category === category){
            str += combineProductHTMLItem(item)
        }
    })
    productList.innerHTML = str;
})

// 購物車功能
productList.addEventListener('click',function(e){
    // 取消標籤預設功能
    e.preventDefault();
    // 確保點擊的是帶有 js-addCart 類別的按鈕
    let addCartClass = e.target.closest(".js-addCart");
    // 如果沒有點到按鈕時中斷
    if (!addCartClass) {
        return;
    }
    // 取得產品ID
    let productId = e.target.getAttribute("data-id");
    let numCheck = 1;

    cartData.forEach(function(item){
        if(item.product.id === productId){
            numCheck = item.quantity += 1;
        }
    })

    // 送出請求並將購物車資訊重新渲染
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
        "productId": productId,
        "quantity": numCheck
    }
    }).then(function(res){
        getCartList()
    }).catch(function(err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    });

})
function getCartList(){
    // 取得購物車資料
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(res){
        // 渲染購物車總金額
        document.querySelector(".js-total").textContent = res.data.finalTotal;
        // 重組購物車字串
        cartData = res.data.carts;
        let str = "";
        cartData.forEach(function(item){
            str += `<tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>NT$${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>NT$${item.product.price * item.quantity}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons" data-id="${item.id}">
                                clear
                            </a>
                        </td>
                    </tr>`
        });
        // 渲染購物車資訊
        cartList.innerHTML = str;
    })
}

// 刪除購物車內容
cartList.addEventListener('click',function(e){
    e.preventDefault();
    const cartId = e.target.getAttribute("data-id");
    if(cartId == null){
        return;
    }
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(res){
        alert("刪除成功");
        getCartList();
    })
})
// 刪除全部購物車內容
discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(res){
        alert("刪除全部購物車品項");
        getCartList();
    })
    .catch(function(res){
        alert("購物車已清空");
    })
})

// 產生訂單功能
const orderInfoBtn = document.querySelector(".orderInfo-btn");

const customerName = document.querySelector("#customerName").value;
const customerPhone = document.querySelector("#customerPhone").value;
const customerEmail = document.querySelector("#customerEmail").value;
const customerAddress = document.querySelector("#customerAddress").value;
const customerTradeWay = document.querySelector("#tradeWay").value;

orderInfoBtn.addEventListener('click',function(e){
    e.preventDefault();
    if(cartData.length == 0){
        alert('請加入購物車');
        return;
    }
    if(customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || customerTradeWay == ""){
        alert('請輸出訂單資訊');
        return;
    }

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
        "data":{
            "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
            }
        }
      })
    .then(function(res){
        alert('已送出訂單');
        document.querySelector("#customerName").value = "";
        document.querySelector("#customerPhone").value = "";
        document.querySelector("#customerEmail").value = "";
        document.querySelector("#customerAddress").value = "";
        document.querySelector("#tradeWay").value = "ATM";
        getCartList()
    })
})