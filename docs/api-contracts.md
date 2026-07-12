# API Response Contracts

## SUCCESS
```json
{
  "success": true,
  "data": {}
}
```

## LIST
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## ERROR
```json
{
  "success": false,
  "error": {
    "code": "VEHICLE_NOT_AVAILABLE",
    "message": "The selected vehicle is not available for dispatch."
  }
}
```
