# 地域別最低賃金API

## 全都道府県分取得
https://minimum-wages-by-prefecture.vercel.app/api/v1/minimum_wages

```
{
  "minimumWages": [
    {
      "prefectureName": "北海道",
      "minimumWage": 920,
      "effectiveStartDate": "2022-10-02"
    },
    ...
  ]
}
```

## 強制的に翌年の最低賃金を取得
クエリパラメータに `forceGetNextYear=true` を付けることで強制的に翌年の最低賃金を取得できます。

https://minimum-wages-by-prefecture.vercel.app/api/v1/minimum_wages?forceGetNextYear=true

```
{
  "minimumWages": [
    {
      "prefectureName": "北海道",
      "minimumWage": 960,
      "effectiveStartDate": "2023-10-01"
    },
    ...
  ]
}
```

### 都道府県を指定して取得
https://minimum-wages-by-prefecture.vercel.app/api/v1/minimum_wage?prefectureName=北海道

```
  {
    "prefectureName": "北海道",
    "minimumWage": 920,
    "effectiveStartDate": "2022-10-02"
  }
```