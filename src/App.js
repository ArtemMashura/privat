import './App.css';
import axios from 'axios';
import ExchangeRate from './components/exchangeRate'
import { useEffect, useRef, useState } from 'react';
let didInit = false
let defaultPurchaseRateInit = false

function App() {
  const [USDdata, setUSDdata] = useState([])
  const [EURdata, setEURdata] = useState([])
  const [PLNdata, setPLNdata] = useState([])
  const [purchaseCurrency, setPurchaseCurrency] = useState("USD")
  const [purchaseRate, setPurchaseRate] = useState(0)
  const [sellCurrency, setSellCurrency] = useState("")
  const [sellRate, setSellRate] = useState(0)
  const tradeRate = sellRate / purchaseRate
  const [customTradeRate, setCustomTradeRate] = useState(0)
  const [selectedAmmount, setSelectedAmmount] = useState(0)
  const result = selectedAmmount * customTradeRate
  
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  useEffect(() => {
    function getDataByCurrency(res, currency){
      let data = res.data.exchangeRate.filter(value => {
        return value.currency === currency
      });
      return data[0]
    }
    

    if (!didInit) {
      didInit = true
      axios.get(
        `https://api.allorigins.win/raw?url=${encodeURIComponent('https://api.privatbank.ua/p24api/exchange_rates?json&date=25.03.2024')}`
      )
      .then(res => {
        setUSDdata(getDataByCurrency(res, "USD"))
        setEURdata(getDataByCurrency(res, "EUR"))
        setPLNdata(getDataByCurrency(res, "PLN"))
        setSellRate(1)
        

      })
    }
  })

  useEffect(() => {
    if (!defaultPurchaseRateInit) {
      setPurchaseRate(USDdata.saleRate)
    }
  }, [USDdata])

  useEffect(() => {
    // let newCustomTradeRate = Math.round(tradeRate * 100) / 100
    // setCustomTradeRate(newCustomTradeRate)
    setCustomTradeRate(tradeRate)
  }, [tradeRate])

  function SellCurrencySelection(e) {
    setSellCurrency(e)
    switch (e) {
      case "UAH":
        setSellRate(1)
        break;
      case "USD":
        setSellRate(USDdata.purchaseRate)
        break;
      case "EUR":
        setSellRate(EURdata.purchaseRate)
        break;
      case "PLN":
        setSellRate(PLNdata.purchaseRate)
        break;
      default:
        setSellRate(1)
    }
    console.log(purchaseRate)
    console.log(sellRate)
  }

  function BuyCurrencySelection(e) {
    setPurchaseCurrency(e)
    switch (e) {
      case "UAH":
        setPurchaseRate(1)
        break;
      case "USD":
        setPurchaseRate(USDdata.saleRate)
        break;
      case "EUR":
        setPurchaseRate(EURdata.saleRate)
        break;
      case "PLN":
        setPurchaseRate(PLNdata.saleRate)
        break;
      default:
        setSellRate(1)
    }
    console.log(purchaseRate)
    console.log(sellRate)
  }

  function setCustomRate(rate) {
    setCustomTradeRate(parseFloat(rate));
    console.log(customTradeRate)
  }

  function swapCurrencies() {
    console.log(ref1.current.value)
    console.log(ref2.current.value)
    setSelectedAmmount(result)

    BuyCurrencySelection(ref1.current.value)
    setSellCurrency(ref2.current.value)
    setPurchaseCurrency(ref1.current.value)
    SellCurrencySelection(ref2.current.value)

  }

  return (
    <div className='privatMenu'>
      <div>
        <div className='currencyHeader'>
  
          <span className="types-currencies">Валюта</span>
          <span className="purchase">Купiвля</span>
          <span className="sale">Продаж</span>
                    
        </div>
        <ExchangeRate currency={EURdata.currency} purchaseRate={EURdata.purchaseRate} saleRate={EURdata.saleRate}/>
        <ExchangeRate currency={USDdata.currency} purchaseRate={USDdata.purchaseRate} saleRate={USDdata.saleRate}/>
        <ExchangeRate currency={PLNdata.currency} purchaseRate={PLNdata.purchaseRate} saleRate={PLNdata.saleRate}/>
      </div>

      <hr className='separator'></hr>
      
      <div className='converter'>
        <span>Конвертер валют</span>
        <div className='converterMenu'>
          <div className='sellCurrency'>
            <select ref={ref1} className='currencySelect' value={sellCurrency} onChange={e => SellCurrencySelection(e.target.value)}>
              <option value="UAH">Українська гривня</option>
              <option value="USD">Долар США</option>
              <option value="EUR">Євро</option>
              <option value="PLN">Польський злотий</option>
              
            </select>
            <input value={selectedAmmount} onChange={e => setSelectedAmmount(e.target.value)} className='ammount'></input>
          </div>

          <div className='switchCurrencies' onClick={e => swapCurrencies()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M25.3636 7.99998L31.7278 14.3642L31.7278 14.3642L25.3642 20.7278L23.95 19.3136L27.9036 15.3599H14V13.3599H27.8951L23.9494 9.41419L25.3636 7.99998Z" fill="black" fillOpacity="0.4"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.3642 32.7277L7.99999 26.3635L8 26.3635L14.3636 19.9999L15.7778 21.4141L11.8242 25.3678L25.7278 25.3678L25.7278 27.3678L11.8327 27.3678L15.7784 31.3135L14.3642 32.7277Z" fill="black" fillOpacity="0.4"></path>
            </svg>
          </div>

          <div className='converterRight'>
            <div className='converterMenuRight'>
              <select ref={ref2} className='currencySelect' value={purchaseCurrency} onChange={e => BuyCurrencySelection(e.target.value)}>
                <option value="UAH">Українська гривня</option>
                <option value="USD">Долар США</option>
                <option value="EUR">Євро</option>
                <option value="PLN">Польський злотий</option>
                
              </select>
              <input value={Math.floor(customTradeRate * 10000) / 10000} onChange={e => setCustomRate(e.target.value)} className='customRate'></input>

            </div>
            <input value={Math.floor(result * 100) / 100} className='result' readOnly='readonly'></input>
          </div>
        </div>
    </div>
  </div>
  );
}

export default App;
