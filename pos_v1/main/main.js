'use strict';
var saveMoney = 0.00;
//TODO: 请在该文件中实现练习要求并删除此注释
function printReceipt(inputs) {
  let allproductsInfo = loadAllItems()
  let allPromotionsInfo = loadPromotions()
  let totalMoney = 0
  let saveMoney = 0
  let originalMoney = 0
  let formatedBuyList = calculateEachItemAmount(inputs)
  let receiptItems = generateEachItemReceipt(formatedBuyList, allproductsInfo, allPromotionsInfo);

  for (let receiptItem of receiptItems) {
    totalMoney += parseFloat(receiptItem.subtotal)
    originalMoney += parseFloat(receiptItem.originalSubtotal)
  }
  saveMoney = originalMoney - totalMoney

  let receiptItemString = "";
  for (const receiptItem of receiptItems) {
    receiptItemString += "\n";
    receiptItemString += `名称：${receiptItem.info.name}，数量：${receiptItem.info.count}${receiptItem.info.unit}，单价：${receiptItem.info.price.toFixed(2)}(元)，小计：${receiptItem.subtotal}(元)`
  }

  const result = `***<没钱赚商店>收据***${receiptItemString}
----------------------
总计：${totalMoney.toFixed(2)}(元)
节省：${saveMoney.toFixed(2)}(元)
**********************`

  console.log(result);
}

function getBarcodeWithoutSpecialChar(barcode) {
  if (barcode.indexOf('-') > 0) {
    return barcode.substr(0, barcode.indexOf('-'));
  }
  return barcode
}

function getCountInBarcode(barcode) {
  if (barcode.indexOf('-') > 0) {
    return parseFloat(barcode.substring(barcode.indexOf('-') + 1));
  }
  return 1
}

function calculateTargetCount(collection, targetBarcode) {
  let count = 0
  for (const barcode of collection) {
    const formatBarcode = getBarcodeWithoutSpecialChar(barcode)
    if (formatBarcode === targetBarcode) {
      count += getCountInBarcode(barcode)
    }
  }
  return count
}

function calculateEachItemAmount(inputs) {
  let result = []
  let mark = new Set()
  for (const barcode of inputs) {
    const target = getBarcodeWithoutSpecialChar(barcode);
    if (mark.has(target)) continue;
    mark.add(target)
    let matchResult = {
      barcode: target,
      count: calculateTargetCount(inputs, target)
    }
    result.push(matchResult)
  }
  return result
}

function generateEachItemReceipt(formatedBuyList, allproductsInfo, allPromotionsInfo) {
  let receiptItems = [];
  for (const buyListItemInfo of formatedBuyList) {
    for (const productInfo of allproductsInfo) {
      if (buyListItemInfo.barcode === productInfo.barcode) {
        const {
          name,
          unit,
          price
        } = productInfo;
        receiptItems.push({
          info: {
            name,
            unit,
            price,
            count: buyListItemInfo.count
          },
          subtotal: calculateSubtotal(buyListItemInfo, price, allPromotionsInfo),
          originalSubtotal: buyListItemInfo.count * price
        })
        break;
      }
    }
  }
  return receiptItems;
}

function calculateSubtotal(item, price, allPromotionsInfo) {
  for (let promotionInfo of allPromotionsInfo) {
    for (let barcode of promotionInfo.barcodes) {
      if (barcode == item.barcode) {
        if (promotionInfo.type === 'BUY_TWO_GET_ONE_FREE') {
          //   saveMoney += (parseInt(item.count / 3)) * price;
          return ((item.count - parseInt(item.count / 3)) * price).toFixed(2)
        }
      }
    }
  }
  return (item.count * price).toFixed(2)
}

function createReceipt(itemsPriceInfo) {
  let total = 0;
  let str = '';
  str += '***<没钱赚商店>收据***\n';
  itemsPriceInfo.forEach(item => {
    str += '名称：' + item.info.name + '，数量：' + item.info.count + item.info.unit + '，单价：' + item.info.price.toFixed(2) + '(元)，小计：' + item.subtotal + '(元)\n';
    total += parseFloat(item.subtotal);
  });

  str += '----------------------\n';
  str += '总计：' + total.toFixed(2) + '(元)\n';

  str += '节省：' + saveMoney.toFixed(2) + '(元)\n';
  str += '**********************';
  console.log(str);
}
