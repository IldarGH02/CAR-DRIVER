export const prepareValue = (value: string) => {
    return Number(value)
}

// export const calculationFuelPrice = (
//     distance: string, 
//     consuption: string, 
//     price: string, 
//     depreciation: string) => 
    
//     {
//         let _distance = prepareValue(distance)
//         let _consuption = prepareValue(consuption)
//         let _price = prepareValue(price)
//         let _depreciationPrice = prepareValue(depreciation)
        
//         const fuelPrice = Number(Math.floor((_distance * (_consuption / 100)) * _price).toFixed(2))
//         const depreciationPrice = Number(Math.floor(_distance * _depreciationPrice).toFixed(2))
//         const fuelVolume = Number(Math.floor(_distance * (_consuption / 100)).toFixed(2))  
        
//         return {
//             fuelPrice,
//             depreciationPrice,
//             fuelVolume
//         }
// }



