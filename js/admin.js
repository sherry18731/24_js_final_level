// 未完待續...

let orderData = [];
const orderList = document.querySelector(".js-orderList");

// 執行初始化資料
function init(){
  getOrderList()
}
init();

// 取的訂單資訊
function getOrderList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers:{
      'Authorization': token,
    }
  })
  .then(function(res){
    orderData = res.data.orders;
    // 組訂單字串
    let str = "";
    orderData.forEach(function(item){
      str = `<tr>
            <td>${item.user.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              <p>Louvre 雙人床架</p>
            </td>
            <td>${item.createdAt}</td>
            <td class="orderStatus">
              <a href="#">${item.paid}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
            </td>
          </tr>`
    })
    orderList.innerHTML = str;
  })

}

