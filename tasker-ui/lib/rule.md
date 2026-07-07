# Utility Functions (lib/utils.ts)

1. **`formatCurrency(amount: number | string, currency?: string, locale?: string)`**:
   - **Chức năng**: Dùng để format các số tiền từ dạng số nguyên/thập phân (ví dụ: `2.000000000000000000000000000000` hoặc `150`) sang định dạng tiền tệ (mặc định là USD dạng `$2.00`).
   - **Yêu cầu**: TẤT CẢ các component khi hiển thị số liệu liên quan tới tiền tệ (budget, price, amount, escrow, spent, v.v...) đều bắt buộc phải bọc giá trị đó bằng hàm `formatCurrency()`. Tuyệt đối không hiển thị chay giá trị trả về từ API.
