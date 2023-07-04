# 地域別最低賃金API

## 全都道府県分取得
https://minimum-wages-by-prefecture.vercel.app/api/v1/minimum_wages

### 都道府県を指定して取得
https://minimum-wages-by-prefecture.vercel.app/api/v1/minimum_wage?prefectureName=北海道

```
{
  "minimumWages": [
    {
      "prefectureName": "北海道",
      "minimumWage": 920,
      "effectiveStartDate": "2022-10-02"
    }
  ]
}
```