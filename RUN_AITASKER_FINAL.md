# AITasker final run notes

## Nếu npm install bị đứng hoặc trỏ nhầm registry
Đã thêm `.npmrc` trong `tasker-ui` và `tasker-backend` để ép dùng registry chính thức:

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
```

## Backend
```bash
cd tasker-backend
npm install
npm run seed
npm run start:dev
```

## Frontend
```bash
cd tasker-ui
npm install --legacy-peer-deps
npm run dev
```

Demo:
- client@aitasker.dev / demo1234
- expert@aitasker.dev / demo1234
- enterprise@aitasker.dev / demo1234
- admin@aitasker.dev / demo1234

Các route kiểm tra nhanh:
- /client/dashboard
- /expert/dashboard
- /admin/dashboard
- /enterprise/dashboard
- /client/settings
- /expert/settings
- /enterprise/settings
- /enterprise/security
- /experts/u_expert
