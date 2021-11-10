# simple shop

簡易的購物網站，使用者可以將喜歡的商品加入願望清單，或者加入購物車，送出訂單時需要申請帳號及帳號驗證通過後才能下訂單，申請帳號部份可透過 facebook、google 進行第三方登入。結賬時可透過藍新金流(測試 API)提供的 web atm、信用卡進行付款，付款前可取消訂單。
管理者方面則可以修改、取消訂單內容，新增、修改、刪除分類種類以及新增、修改、刪除產品內容。

## Live demo

[連結](https://zhihproject.website/)



DEMO 帳號

| role  | account           | password | 帳號驗證 |
| ----- | ----------------- | -------- | -------- |
| user  | user1@example.com | 12346578 | yes      |
| user  | user2@example.com | 12346578 | no       |
| admin | root@example.com  | 12345678 | #        |

## 功能

- 使用者可建立個人帳戶
- 使用者可使用 facebook、google 登入
- 使用者可以修改密碼及個人資訊
- 使用者可以觀看過往屬於個人的訂單資訊
- 使用者可將商品加入願望清單，並從願望清單內加入至購物車
- 使用者可以依分類瀏覽、搜尋所有商品及查看商品詳細資訊
- 使用者可以調整依照上架早晚、價錢高低查看商品
- 使用者可將商品加入購物車，並在購物車內選調整產品數量
- 使用者確定購買清單後可以下訂單，下單完成後會收到訂單通知信
- 使用者可以使用信用卡、web atm 進行結帳
- 管理者可以查看、新增、修改、刪除種類
- 管理者可以查看、新增、修改、刪除商品
- 管理者可以查看、修改、取消訂單

## 環境設置

### 開發與框架

```
 "express": "^4.16.4"
```

### 資料庫

```
"mongoDB": "^4.2.0"
"mongoose": "^5.13.9",
```

### 使用者驗證

```
"passport": "^0.4.0"
"passport-local": "^1.0.0"
"passport-facebook": "^3.0.0"
"passport-google-oauth20": "^2.0.0"
```

### 圖床與上傳

```
"aws-sdk": "^2.995.0"
"multer": "^1.4.3"
```

### 信件寄送

```
"nodemailer": "^6.6.3"
```

### 模板

```
"express-handlebars": "^5.3.3"
```

## 安裝與使用

1. 使用終端機，clone 專案到 local

```
git clone  https://github.com/Side-Project-Zhih/simple_shop.git
```

2. 進入專案資料夾

```
 cd simple_shop
```

3. 安裝套件

```
npm install
```

4. 安裝 MySQL 及建立資料庫

- 需要與 config/config.json 一致

```
Robot3T 新增 database  MYSHOP
```

5. 新增種子資料

```
npm run seed
```

7. 建立 env

```
googleAccount= //使用的信箱
googleClientId_mail= //Gmail api clinetId
googleClientSecret_mail= //Gmail api secret
refreshToken= //Gmail refreshToken
accessToken= //Gmail accessToken
googleClientId_login= //google 登入 Oauth2.0 clinetId
googleClientSecret_login= //google 登入 Oauth2.0 secret
facebookClientId= ///facebook 登入 Oauth2.0 clinetId
facebookClientSecret= //facebook 登入 Oauth2.0 secret
s3accessKeyId= //AWS 帳戶 accessKeyId
s3secretAccessKey= //AWS 帳戶 secretAccessKey
mongoDBurl= //mongoDB atlas 資料庫連結
BaseUrl= //網站網址
```

8. 開啟 server

```
node app.js
```

## 路由 簡介說明

---

## 首頁

| 方法 | 事件名稱 | 內容               |
| ---- | -------- | ------------------ |
| GET  | ​​/      | 查看所有商品(首頁) |

## admin(管理)

### product

| 方法   | 事件名稱                 | 內容                 |
| ------ | ------------------------ | -------------------- |
| GET    | ​​/admin/products        | 查看所有商品         |
| GET    | ​​/admin/products/search | 搜尋商品並呈列       |
| POST   | ​​/admin/products/upload | 產品描述區域上傳圖片 |
| GET    | ​​/admin/products/create | 建立商品頁面         |
| GET    | ​​/admin/products/:id    | 取得商品詳細資訊     |
| PUT    | ​​/admin/products/:id    | 修改產品內容         |
| DELETE | ​​/admin/products/:id    | 刪除商品             |
| POST   | ​​/admin/products        | 建立新商品           |

### order

| 方法 | 事件名稱                  | 內容             |
| ---- | ------------------------- | ---------------- |
| GET  | ​​/admin/orders           | 查看所有訂單     |
| GET  | ​​/admin/orders/search    | 搜尋訂單並呈列   |
| POST | ​​/admin/orders/:id/check | 確認訂單修改內容 |
| PUT  | ​​/admin/orders/:id       | 修改訂單         |
| GET  | ​​/admin/orders/:id       | 取得修改訂單頁面 |

### category

| 方法   | 事件名稱                | 內容             |
| ------ | ----------------------- | ---------------- |
| GET    | ​​/admin/categories     | 查看所有產品種別 |
| POST   | ​​/admin/categories/:id | 新增產品類別     |
| PUT    | ​​/admin/categories/:id | 修改產品類別     |
| DELETE | ​​/admin/categories/:id | 刪除產品類別     |

## Users(使用者)

| 方法 | 事件名稱                        | 內容                   |
| ---- | ------------------------------- | ---------------------- |
| GET  | ​​/users/login                  | 取得登入頁面           |
| POST | ​​/users​/login                 | 使用者登入             |
| GET  | ​​/users/register               | 取得註冊帳號頁面       |
| POST | ​​/users/register               | 使用者註冊帳號         |
| GET  | ​​/users​/logout                | 使用者登出             |
| GET  | ​​/users​/:id/validation/:email | 確認驗證信             |
| POST | ​​/users​/:id/validation        | 傳送驗證信             |
| GET  | ​​/users​/{id}​/orders          | 取得該使用者的所有訂單 |
| GET  | ​​/users​/{id}                  | 查看使用者個人資料     |
| PUT  | ​​/users​/{id}​                 | 修改使用者資料         |

## product(產品)

| 方法 | 事件名稱                | 內容                 |
| ---- | ----------------------- | -------------------- |
| GET  | ​​/products /:productId | 查看指定商品詳細內容 |
| GET  | ​​/products/search      | 搜尋商品並呈列       |

## cart(購物車)

| 方法   | 事件名稱     | 內容                   |
| ------ | ------------ | ---------------------- |
| GET    | ​/cart       | 查看購物車內的商品項目 |
| POST   | ​/cart       | 商品加入購物車         |
| put    | ​/cart       | 修改購物車商品數量     |
| delete | ​/cart       | 從購物車移除商品       |
| get    | ​/cart/check | 回覆指定貼文           |

## wishlist(願望清單)

| 方法 | 事件名稱    | 內容                 |
| ---- | ----------- | -------------------- |
| GET  | ​​/wishlist | 取得願望清單內的商品 |
| POST | ​​/wishlist | 加入商品進願望清單   |
| PUT  | ​​/wishlist | 從願望清單移除商品   |

## order(訂單)

| 方法   | 事件名稱                   | 內容                       |
| ------ | -------------------------- | -------------------------- |
| GET    | ​/orders/:id               | 查看指定訂單               |
| POST   | ​/orders                   | 送出指定訂單               |
| POST   | ​/orders//payment/callback | 接收藍金金流交易後回傳資料 |
| delete | ​/orders/:id               | 取消訂單                   |

## auth

| 方法 | 事件名稱                  | 內容                           |
| ---- | ------------------------- | ------------------------------ |
| GET  | ​/auth/google             | 取得 google 授權               |
| GET  | ​​/auth/google/callback   | 接收 google 回授權後回傳資訊   |
| GET  | ​/auth/facebook           | 取得 facebook 授權             |
| GET  | ​​/auth/facebook/callback | 接收 facebook 回授權後回傳資訊 |
