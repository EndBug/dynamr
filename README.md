# @endbug/dynamr

_Wrapper for the DynamR controller API_

This package is meant as a wrapper for the [DynamR](https://www.dynamr.com/) controller API, used in indoor skydiving.  
More details about its usage can be found on the official website ([dynamr.com](https://www.dynamr.com/)) and in the manuals:

- [User guide](https://www.dynamr.com/en/tech/_bottom/dynamr_user_guide.pdf)
- [DynamR API Documentation](https://www.dynamr.com/en/tech/_bottom/dynamr_api_doc.pdf)

## Usage

```ts
import DynamR from '@endbug/dynamr'

const dynamr = new DynamR({
  protocol: 'http',
  hostname: '123.123.123.123',
  port: '1234'
})

dynamr.getPresets()
  .then(console.log)
```

## Methods: 

- `getPresets`
- `getLightStatus`
- `setLightPreset`
- `setLightColor`
- `beginSession`
- `exitSession`
- `endSession`
- `getSessionStatus`
- `reloadSpeedRound`
- `bustEnter`
- `bustLeave`
- `stopSpeedRound`
- `setODE`
- `setETH0`

Please see the TS and JSDoc annotations for more info.
