# TechPro E-Commerce - Checklist debug

Ngay kiem tra: 2026-05-18

## Ket qua lenh kiem tra sau sua

| Hang muc | Lenh | Ket qua | Ghi chu |
|---|---|---|---|
| Frontend build | `pnpm build` trong `frontend` | PASS | Vite build thanh cong, route da lazy-load nen khong con canh bao chunk JS > 500 kB. |
| Frontend lint | `pnpm lint` trong `frontend` | PASS | Da don import React du, tach context value, sua cac loi hooks/purity chinh. |
| Backend build | `dotnet build` trong `backend` | PASS | ASP.NET project build thanh cong voi cac endpoint `/api` moi. |
| Product CRUD API | `POST/PUT/DELETE https://localhost:7099/api/products` | PASS | Tao, sua, xoa san pham test thanh cong sau khi restart backend. |
| Order status API | `POST /api/orders`, `GET /api/orders?email=...`, `PUT /api/orders/{orderNumber}/status` | PASS | Tao don test, loc theo email va doi trang thai sang `Packed` thanh cong. |
| JSON persistence | Restart backend + doc lai product/order test | PASS | `products.json` va `orders.json` giu du lieu sau restart backend. |
| Users API | `GET /api/users`, `PUT /api/users/{id}`, `POST /api/auth/login` | PASS | Login tra role Admin, doc user list, suspend/restore user thanh cong. |
| Admin role guard | `pnpm lint`, `pnpm build` | PASS | `/admin` yeu cau dang nhap va user role `Admin`; user thuong bi redirect ve `/account`. |
| SQL baseline | `database/schema.sql`, `database/seed.sql` | DA THEM | Co schema SQL Server/Azure SQL cho users/products/orders/reviews/newsletter/addresses/wishlist va seed ban dau. |
| SQL runtime core APIs | `GET /api/system/storage`, Products, Auth/Users, Orders, Reviews, Newsletter | DA NOI | Backend co `SqlStore` cho Products CRUD, Users/Auth, Orders, ProductReviews va Newsletter; tu dung SQL neu `TechProDb` san sang, fallback JSON neu SQL/schema chua co. |
| CI/CD baseline | `.github/workflows/ci.yml`, `.github/workflows/release-artifacts.yml` | DA THEM | CI chay frontend lint/build, backend build, verify SQL assets. Release workflow build frontend/backend va upload artifacts. |
| Git status | `git status --short` | CO THAY DOI | Dang co nhieu file da sua/moi: frontend, backend, SQL database, CI/CD va file build/obj da track tu truoc. |

## Checklist chuc nang

| Khu vuc / Trang | Trang thai | Chung cu file | Van de / ghi chu | Muc uu tien |
|---|---|---|---|---|
| Routing tong | Da hoat dong va toi uu chunk | `frontend/src/App.jsx` | Cac route chinh co khai bao: `/`, `/products`, `/products/:id`, `/cart`, `/checkout`, `/account`, `/news`, `/news/:id`, v.v.; page route da lazy-load qua `React.lazy`/`Suspense`. | Cao |
| Link san pham tu Home | Da sua | `frontend/src/pages/Home.jsx` | Da doi `/product/:id` thanh `/products/:id`; route detail khop `App.jsx`. | Cao |
| Product List | Da hoat dong voi API va fallback mock | `frontend/src/pages/ProductList.jsx`, `backend/Program.cs` | Frontend goi `/api/products`, backend da co endpoint, fallback mock van giu neu API loi. | Cao |
| Bo loc Product List | Da sua logic chinh | `frontend/src/pages/ProductList.jsx` | Search, category, brand, RAM, price, sort, pagination da tac dong vao danh sach. | Cao |
| Loading Product List | Da sua | `frontend/src/pages/ProductList.jsx` | Da hien spinner khi dang tai san pham. | Trung binh |
| Product Detail | Da sua | `frontend/src/pages/ProductDetail.jsx` | Gallery images da dua ra ngoai component, khong con loi dung bien truoc khi khai bao. | Cao |
| Gio hang | Hoat dong localStorage | `frontend/src/context/CartContext.jsx`, `frontend/src/pages/Cart.jsx` | Them/xoa/cap nhat so luong/tinh tong hoat dong bang localStorage. Nut promo `Apply` chua co logic giam gia. | Trung binh |
| Checkout | Da noi Order API | `frontend/src/pages/Checkout.jsx`, `frontend/src/api/orderApi.js`, `backend/Program.cs` | Dat hang goi `POST /api/orders`, clear cart khi thanh cong, co fallback local neu backend loi. | Cao |
| Checkout auth guard | Da noi voi auth context | `frontend/src/pages/Checkout.jsx`, `frontend/src/context/AuthContext.jsx` | Trang checkout chan neu chua login; login tao session localStorage. | Cao |
| Login / Register | Da sua luong chinh | `frontend/src/pages/Login.jsx`, `frontend/src/context/AuthContext.jsx` | Form submit goi `login()`, luu user/token, dieu huong account. OAuth buttons van chi UI. | Cao |
| Register mode tu link | Da sua | `frontend/src/pages/Login.jsx` | Login doc `location.state?.mode`, bam "Create Identity" mo dung tab register. | Trung binh |
| Forgot password | Da gan ve support | `frontend/src/pages/Login.jsx` | Link chuyen sang `/contact` thay vi `href="#"`. | Thap |
| Account | Da sua nhieu luong chinh | `frontend/src/pages/Account.jsx`, `frontend/src/api/orderApi.js`, `frontend/src/api/userApi.js` | Hien user tu context, logout that, order history doc tu API, profile update qua Users API, address book va wishlist co state/localStorage theo email. | Cao |
| Admin Dashboard | Da noi du lieu live co ban | `frontend/src/pages/Admin.jsx`, `backend/Program.cs` | Revenue/order count/product count doc tu Order/Product API. | Trung binh |
| Admin Products CRUD | Da sua | `frontend/src/pages/Admin.jsx`, `frontend/src/api/productApi.js`, `backend/Program.cs` | Admin co form them/sua/xoa san pham, backend co `POST/PUT/DELETE /api/products`, da test API thanh cong. Du lieu van in-memory nen restart backend se mat thay doi. | Cao |
| Admin Orders | Da sua | `frontend/src/pages/Admin.jsx`, `frontend/src/api/orderApi.js`, `backend/Program.cs` | Orders doc tu API that, co refresh, search, filter theo status, detail modal va cap nhat status qua `PUT /api/orders/{orderNumber}/status`. | Cao |
| Admin Users | Da sua | `frontend/src/pages/Admin.jsx`, `frontend/src/api/userApi.js`, `backend/Program.cs` | Users doc tu API that, co search/filter role/status, doi role/status va user bi Suspended se bi chan login. | Cao |
| Admin route guard | Da sua | `frontend/src/App.jsx`, `frontend/src/context/AuthContext.jsx` | `/admin` chi cho role `Admin`; chua dang nhap ve `/login`, user khong phai Admin ve `/account`. | Cao |
| News | Hoat dong mot phan | `frontend/src/pages/News.jsx`, `frontend/src/pages/NewsDetail.jsx` | `/news/:id` da co trang detail, nhung grid o News chu yeu la article/cursor, trending links `href="#"`, newsletter khong submit API. | Trung binh |
| Header search | Da sua | `frontend/src/components/Header.jsx` | Search desktop/mobile dieu huong sang `/products?q=...`. | Cao |
| Header mega menu | Hoat dong co dieu kien | `frontend/src/components/Header.jsx` | Link category dung `/products?category=...`, nhung brand filter sinh chuoi co the khong match voi mock product name nen de ra empty state. | Trung binh |
| Backend API | Da bo sung API co persistence va SQL fallback | `backend/Program.cs`, `backend/SqlStore.cs`, `frontend/src/utils/axiosClient.js:5` | Backend co products CRUD, auth login/register/profile, orders CRUD co status, users list/update, reviews, newsletter, them CORS cho Vite. Core APIs tu dung SQL khi co `TechProDb`, fallback JSON khi SQL chua san sang. | Rat cao |
| Database SQL | Da them baseline va runtime core | `database/schema.sql`, `database/seed.sql`, `backend/appsettings*.json`, `backend/SqlStore.cs` | Da co schema/seed, connection string `TechProDb`, SQL store cho Products CRUD + Users/Auth + Orders + ProductReviews + Newsletter va fallback JSON. Address/wishlist con localStorage/frontend state. | Cao |
| CI/CD | Da them baseline | `.github/workflows/ci.yml`, `.github/workflows/release-artifacts.yml` | PR/push CI va artifact packaging da co; chua co deploy len hosting that vi chua co secrets/target server. | Cao |
| Axios client | Da khop hop dong API co ban | `frontend/src/utils/axiosClient.js:5`, `backend/Program.cs` | Base URL `/api` khop cac endpoint moi. | Cao |
| Hieu ung CSS chung | Hoat dong phan lon | `frontend/src/index.css` | `glass`, `glow-primary`, `fade-in-up`, `fade-in`, `hover-lift`, `ticker`, `shimmer` da dinh nghia. | Thap |
| Class hieu ung bi thieu | Da sua | `frontend/src/index.css` | Da them `glass-panel` va `custom-scrollbar`. | Trung binh |
| Keyframe tuy bien | Da sua | `frontend/src/index.css` | Da them `scanner` va `translateX`. | Trung binh |
| Lint React imports | Da sua | Nhieu file `.jsx` | Da bo import `React` du. | Thap |
| Hooks / React rules | Da sua | `AuthContext.jsx`, `CartContext.jsx`, `Header.jsx`, `ProductList.jsx`, `Checkout.jsx`, `ProductDetail.jsx` | `pnpm lint` pass. | Trung binh |
| Demo folder | Tham khao thiet ke | `demo/` | Nhieu file HTML/screenshot demo, khong tham gia build frontend/backend hien tai. | Thap |

## Viec nen sua truoc

| Thu tu | Viec can lam | File lien quan |
|---|---|---|
| 1 | Nang address/wishlist len backend SQL de dong bo nhieu thiet bi. | `Account.jsx`, backend account API, `backend/SqlStore.cs` |
| 2 | Them deploy target that cho CD khi co server/secrets. | `.github/workflows/release-artifacts.yml` |
| 3 | Bo sung test tu dong API backend va frontend smoke test cho CI. | `backend`, `frontend`, `.github/workflows/ci.yml` |
| 4 | Chuan hoa migration/versioning SQL neu tiep tuc phat trien database. | `database/`, backend startup |
