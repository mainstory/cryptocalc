function save(key, value) {
   localStorage.setItem(key, value);
}
function get(key) {
   const value = localStorage.getItem(key);
   return value
}
function remove(key) {
   localStorage.removeItem(key);
}

// pasteLocalStorage
if (get('data-balance-usdt') !== null) {
   document.querySelector('[data-input-mode]').setAttribute('data-input-mode', get('mode'))
   if (get('mode') === 'long') {
      document.querySelector('[data-input-mode]').innerText = '↑'
      document.querySelector('[data-input-mode]').classList.add('_green')
   } else {
      document.querySelector('[data-input-mode]').innerText = '↓'
      document.querySelector('[data-input-mode]').classList.add('_remove')
   }

   document.querySelector('[data-input="first"]').value = get('first')
   document.querySelector('[data-input="second"]').value = get('second')
   document.querySelector('[data-input="shoulder"]').value = get('shoulder')
   document.querySelector('[data-input="addProcent"]').value = get('addProcent')
   document.querySelector('[data-input="price"]').value = get('data-balance-usdt')
   if (get('data-liquidation') !== null) {
      document.querySelector('[data-liquidation]').innerText = `${get('data-liquidation')}%`
      document.querySelector('[data-liquidation]').setAttribute('data-liquidation', Number(get('data-liquidation')))
   }


   document.querySelector('[data-deals]').innerText = get('data-deals')

   document.querySelector('[data-profit-usdt]').innerText = get('data-profit-usdt')
   document.querySelector('[data-profit-usdt]').setAttribute('data-profit-usdt', Number(get('data-profit-usdt')))

   document.querySelector('[data-profit-uah]').innerText = get('data-profit-uah')
   document.querySelector('[data-profit-uah]').setAttribute('data-profit-uah', Number(get('data-profit-uah')))

   document.querySelector('[data-balance-usdt]').innerText = get('data-balance-usdt')
   document.querySelector('[data-balance-uah]').innerText = get('data-balance-uah')

   document.querySelector('[data-profit-usdt]').classList.add(get('colorGeneralProfit'))
   document.querySelector('[data-profit-uah]').classList.add(get('colorGeneralProfit'))

   document.querySelector('[data-field]').innerText = get('template')

}
if (get('colorInputFirst') !== null) {
   document.querySelector('[data-input="first"]').classList.add('_active')
}
if (get('colorInputSecond') !== null) {
   document.querySelector('[data-input="second"]').classList.add('_active')
}
if (get('first') !== null) {
   document.querySelector('[data-input="first"]').value = Number(get('first'))
}
if (get('second') !== null) {
   document.querySelector('[data-input="second"]').value = Number(get('second'))
}

function main() {

   const mode = document.querySelector('[data-input-mode]').getAttribute('data-input-mode')
   let modeText = ''
   let takeOrLose = ''
   let symbol = ''
   const startPrice = Number(document.querySelector('[data-input="price"]').value)
   let price = Number(document.querySelector('[data-input="price"]').value)

   const addProcent = Number(document.querySelector('[data-input="addProcent"]').value)

   // LONG или SHORT режим
   function longOrShort() {
      let first = Number(document.querySelector('[data-input="first"]').value)
      let second = Number(document.querySelector('[data-input="second"]').value)

      if (document.querySelector('[data-input-mode]').getAttribute('data-input-mode') === 'long') {
         return { first, second }
      }
      if (document.querySelector('[data-input-mode]').getAttribute('data-input-mode') === 'short') {
         const firstFix = first
         const secondFix = second
         first = secondFix
         second = firstFix
         return { first, second }
      }

   }
   let { first, second } = longOrShort()

   const resultAddProcent = (1 + (addProcent / 100)) * first


   const shoulder = Number(document.querySelector('[data-input="shoulder"]').value)
   price = price * shoulder

   // сменить режим для добавочных процентов
   function checkAddPRocent() {
      if (addProcent === 0) {
         return second
      } else {
         second = resultAddProcent
         return second
      }
   }
   second = checkAddPRocent()
   function checkMode() {
      if (mode === 'long') {
         save('mode', mode)
         modeText = 'лонг'
         return modeText
      }
      if (mode === 'short') {
         save('mode', mode)
         modeText = 'шорт'
         return modeText
      }
   }
   modeText = checkMode()


   const result = price / first * second
   const resultUAH = result * 39
   const profit = result - price
   const profitUAH = profit * 39
   const priceUAH = price * 39

   const procent = ((second - first) / first) * 100



   function checkProfit() {
      if (profit >= 0) {
         takeOrLose = '✅'
         return takeOrLose
      } else {
         takeOrLose = '❌'
         return takeOrLose
      }
   }
   takeOrLose = checkProfit()
   function checkSymbol() {
      if (profit >= 0) {
         symbol = '+'
         return symbol
      } else {
         symbol = ''
         return symbol
      }
   }
   symbol = checkSymbol()

   save('first', first)
   save('second', second)
   save('shoulder', shoulder)
   save('addProcent', addProcent)

   const template = `${takeOrLose}
${modeText}
${(price / shoulder).toFixed(4)} ${(priceUAH / shoulder).toFixed(4)}
${first}
${second}
${shoulder}x
${symbol}${profit.toFixed(4)} ${symbol}${profitUAH.toFixed(4)}
${symbol}${procent.toFixed(2)}%
${(startPrice + profit).toFixed(4)} ${((startPrice * 39) + profitUAH).toFixed(4)}  
   `
   console.log(template)
   navigator.clipboard.writeText(template)
   save('template', template)

   console.log(`
   ===============================================
   #{takeOrLose} ${takeOrLose}
#{modeText} #{modeText} ${modeText} ${modeText}
#{(${price} / ${shoulder}).toFixed(4)} #{(${priceUAH} / ${shoulder}).toFixed(4)} #{(${price} / ${shoulder}).toFixed(4)} #{(${priceUAH} / ${shoulder}).toFixed(4)} ${(price / shoulder).toFixed(4)} ${(priceUAH / shoulder).toFixed(4)}
#{first} ${first}
#{second} ${second}
#{shoulder}x ${shoulder}x
#{symbol}#{${profit}.toFixed(4)} #{symbol}#{${profitUAH}.toFixed(4)} ${symbol}${profit.toFixed(4)} ${symbol}${profitUAH.toFixed(4)}
#{symbol}#{${procent}.toFixed(2)}% ${symbol}${procent.toFixed(2)}%
#{(${startPrice} + ${profit}).toFixed(4)} #{((${startPrice} * 39) + ${profitUAH}).toFixed(4)} ${(startPrice + profit).toFixed(4)} ${((startPrice * 39) + profitUAH).toFixed(4)}  
===============================================
   `);

   if (addProcent === 0) {
      document.querySelector('[data-input="price"]').value = (startPrice + profit).toFixed(4)

      const balanceUsdt = Number(document.querySelector('[data-balance-usdt]').innerText)
      const balanceUah = Number(document.querySelector('[data-balance-uah]').innerText)
      document.querySelector('[data-balance-usdt]').innerText = `${(balanceUsdt + profit).toFixed(4)}`
      document.querySelector('[data-balance-uah]').innerText = `${(balanceUah + profitUAH).toFixed(4)}`
      save('data-balance-usdt', `${(balanceUsdt + profit).toFixed(4)}`)
      save('data-balance-uah', `${(balanceUah + profitUAH).toFixed(4)}`)

      const generalProfitUsdt = Number(document.querySelector('[data-profit-usdt]').getAttribute('data-profit-usdt'))
      const generalProfitUah = Number(document.querySelector('[data-profit-uah]').getAttribute('data-profit-uah'))

      document.querySelector('[data-profit-usdt]').setAttribute('data-profit-usdt', `${(generalProfitUsdt + profit).toFixed(4)}`)
      document.querySelector('[data-profit-usdt]').innerText = `${(generalProfitUsdt + profit).toFixed(4)}`
      save('data-profit-usdt', `${(generalProfitUsdt + profit).toFixed(4)}`)

      document.querySelector('[data-profit-uah]').setAttribute('data-profit-uah', `${(generalProfitUah + profitUAH).toFixed(4)}`)
      document.querySelector('[data-profit-uah]').innerText = `${(generalProfitUah + profitUAH).toFixed(4)}`
      save('data-profit-uah', `${(generalProfitUah + profitUAH).toFixed(4)}`)

      document.querySelector('[data-input="first"]').classList.remove('_active')
      document.querySelector('[data-input="second"]').classList.remove('_active')
      remove('colorInputFirst')
      remove('colorInputSecond')

      const updateGeneralProfitUsdt = Number(document.querySelector('[data-profit-usdt]').getAttribute('data-profit-usdt'))

      if (updateGeneralProfitUsdt >= 0) {
         document.querySelector('[data-profit-usdt]').classList.add('_green')
         document.querySelector('[data-profit-uah]').classList.add('_green')
         document.querySelector('[data-profit-usdt]').classList.remove('_red')
         document.querySelector('[data-profit-uah]').classList.remove('_red')
         save('colorGeneralProfit', `_green`)


      } else {
         document.querySelector('[data-profit-usdt]').classList.add('_red')
         document.querySelector('[data-profit-uah]').classList.add('_red')
         document.querySelector('[data-profit-usdt]').classList.remove('_green')
         document.querySelector('[data-profit-uah]').classList.remove('_green')
         save('colorGeneralProfit', `_red`)
      }

      const dealsNewValue = Number(document.querySelector('[data-deals]').innerText) + 1
      document.querySelector('[data-deals]').innerText = dealsNewValue
      save('data-deals', dealsNewValue)



   }
   document.querySelector('[data-field]').innerText = template



}

document.addEventListener('click', (event) => {
   const eventTarget = event.target

   if (eventTarget.closest('[data-input-mode]')) {
      const value = eventTarget.closest('[data-input-mode]').getAttribute('data-input-mode')
      if (value === 'long') {
         eventTarget.closest('[data-input-mode]').setAttribute('data-input-mode', 'short')
         eventTarget.closest('[data-input-mode]').innerText = '↓'

      }
      if (value === 'short') {
         eventTarget.closest('[data-input-mode]').setAttribute('data-input-mode', 'long')
         eventTarget.closest('[data-input-mode]').innerText = '↑'
      }
   }

})

// active
document.querySelector('[data-button]').addEventListener('click', (event) => {
   main()
})
document.addEventListener("keypress", function (event) {
   if (event.keyCode === 13) {
      main()
   }
});

// copy
document.querySelector('[data-copy-price]').addEventListener('click', (event) => {
   const price = document.querySelector('[data-input="price"]').value
   navigator.clipboard.writeText(price)
})
document.querySelector('[data-copy-first]').addEventListener('click', (event) => {
   const first = document.querySelector('[data-input="first"]').value
   navigator.clipboard.writeText(first)
})
document.querySelector('[data-copy-second]').addEventListener('click', (event) => {
   const second = document.querySelector('[data-input="second"]').value
   navigator.clipboard.writeText(second)
})

// paste
document.querySelector('[data-paste-price]').addEventListener('click', (event) => {
   navigator.clipboard.readText().then(clipText => {
      document.querySelector('[data-input="price"]').value = Number(clipText)
   }).catch(error => {
      console.error('Ошибка чтения из буфера обмена:', error)
   })
})
document.querySelector('[data-paste-first]').addEventListener('click', (event) => {
   navigator.clipboard.readText().then(clipText => {

      document.querySelector('[data-input="first"]').value = Number(clipText)
   }).catch(error => {
      console.error('Ошибка чтения из буфера обмена:', error)
   })
})
document.querySelector('[data-paste-second]').addEventListener('click', (event) => {
   navigator.clipboard.readText().then(clipText => {
      document.querySelector('[data-input="second"]').value = Number(clipText)
   }).catch(error => {
      console.error('Ошибка чтения из буфера обмена:', error)
   })
})

// change
document.querySelector('[data-change]').addEventListener('click', (event) => {
   const first = Number(document.querySelector('[data-input="first"]').value)
   const second = Number(document.querySelector('[data-input="second"]').value)

   document.querySelector('[data-input="first"]').value = second
   document.querySelector('[data-input="second"]').value = first
})

document.querySelector('[data-input="shoulder"]').addEventListener('input', (event) => {

   if (Number(document.querySelector('[data-input="shoulder"]').value) === 0) {
      document.querySelector('[data-liquidation]').innerText = `0%`
      save('data-liquidation', 0)
   } else {
      const liquidationProcent = 100 / Number(document.querySelector('[data-input="shoulder"]').value)
      document.querySelector('[data-liquidation]').innerText = `${liquidationProcent.toFixed(1)}%`
      save('data-liquidation', `${liquidationProcent.toFixed(1)}`)

   }

})

document.addEventListener('keydown', function (event) {
   // Получаем код нажатой клавиши
   var keyCode = event.code;

   // Проверяем нажатие клавиш "1", "2" и "r"
   switch (keyCode) {
      case 'KeyQ':
         // Действие при нажатии клавиши "1"
         navigator.clipboard.readText().then(clipText => {

            document.querySelector('[data-input="first"]').value = Number(clipText)
            document.querySelector('[data-input="first"]').classList.add('_active')
            save('colorInputFirst', '_active')
            save('first', clipText)
         }).catch(error => {
            console.error('Ошибка чтения из буфера обмена:', error)
         })
         break;
      case 'KeyW':
         // Действие при нажатии клавиши "2"
         navigator.clipboard.readText().then(clipText => {
            document.querySelector('[data-input="second"]').value = Number(clipText)
            document.querySelector('[data-input="second"]').classList.add('_active')
            save('colorInputSecond', '_active')
            save('second', clipText)

         }).catch(error => {
            console.error('Ошибка чтения из буфера обмена:', error)
         })
         break;
      case 'KeyR':
         // Действие при нажатии клавиши "r"
         const first = Number(document.querySelector('[data-input="first"]').value)
         const second = Number(document.querySelector('[data-input="second"]').value)

         document.querySelector('[data-input="first"]').value = second
         document.querySelector('[data-input="second"]').value = first
         break;
      case 'KeyV':
         // Действие при нажатии клавиши "r"
         const value = document.querySelector('[data-input-mode]').getAttribute('data-input-mode')
         if (value === 'long') {
            document.querySelector('[data-input-mode]').setAttribute('data-input-mode', 'short')
            document.querySelector('[data-input-mode]').innerText = '↓'

         }
         if (value === 'short') {
            document.querySelector('[data-input-mode]').setAttribute('data-input-mode', 'long')
            document.querySelector('[data-input-mode]').innerText = '↑'
         }
         break;
      default:
         // Другие клавиши не обрабатываем
         break;
   }
});




document.querySelector('[data-reset]').addEventListener('click', (event) => {
   remove('data-profit-usdt')
   remove('data-profit-uah')
   remove('data-deals')
   remove('template')
   remove('colorInputFirst')
   remove('colorInputSecond')

   document.querySelector('[data-profit-usdt]').innerText = 0
   document.querySelector('[data-profit-usdt]').setAttribute('data-profit-usdt', 0)

   document.querySelector('[data-profit-uah]').innerText = 0
   document.querySelector('[data-profit-uah]').setAttribute('data-profit-uah', 0)

   document.querySelector('[data-deals]').innerText = 0
   document.querySelector('[data-field]').innerText = ''

   document.querySelector('[data-profit-usdt]').classList.remove('_green')
   document.querySelector('[data-profit-uah]').classList.remove('_green')
   document.querySelector('[data-profit-usdt]').classList.remove('_red')
   document.querySelector('[data-profit-uah]').classList.remove('_red')

   document.querySelector('[data-input="first"]').classList.remove('_active')
   document.querySelector('[data-input="second"]').classList.remove('_active')


   save('data-deals', 0)
   save('data-profit-usdt', 0)
   save('data-profit-uah', 0)
})


// // Функция для получения текущего курса
// async function fetchPrice() {
//    try {
//       const response = await fetch('https://api.coincap.io/v2/assets/gala');
//       const data = await response.json();
//       const price = Number(data.data.priceUsd).toFixed(8);
//       console.log("Текущий курс GALA к USD:", price);
//       document.querySelector('[data-course]').innerText = price
//    } catch (error) {
//       console.error('Произошла ошибка:', error);
//    }
// }

// // Вызов функции fetchPrice() сразу для первоначального получения курса
// fetchPrice();

// // Запускаем функцию fetchPrice() каждую секунду
// setInterval(fetchPrice, 30000);


// document.addEventListener('click', (event) => {
//    const eventTarget = event.target

//    if (eventTarget.closest('[data-course]')) {

//       navigator.clipboard.writeText(eventTarget.closest('[data-course]').innerText)
//    }

// })

















