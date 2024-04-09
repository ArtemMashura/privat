import "./exchangeRate.css"

function App({currency, purchaseRate, saleRate}) {
  return (
    <div className="currencyRate">
        <div className="names">
            <span>
                {currency}
                <span className="compareCurrency">UAH</span>
            </span>
        </div>
        <div className="purchase">
            <span>{purchaseRate}</span>
        </div>
        <div className="sale">
            <span>{saleRate}</span>
        </div>
    </div>
    

    // <div >
    //   <label>{currency}{exchangeRate}</label>
    // </div>
  );
}

export default App;
