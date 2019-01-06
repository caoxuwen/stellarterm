const React = window.React = require('react');
import directory from '../../directory';

import _ from 'lodash';

export default class MarginInfo extends React.Component {
  constructor(props) {
    super(props);
    this.unsub = this.props.d.session.event.sub(() => { this.forceUpdate() });
  }
  componentWillUnmount() {
    this.unsub();
  }
  render() {
    if (this.props.d.session.state !== 'in') {
      return <div className="island__paddedContent"><a href="#account">Log in</a> to see your margin info</div>;
    }

    let orderbook = this.props.d.orderbook.data;

    let account = this.props.d.session.account;

    let oracle = this.props.d.session.oracle;
    let last_price = 0;
    if (oracle) {
      let price_buffer_str = oracle.data_attr["ETH-USD"];
      if (price_buffer_str) {
        let price_str = Buffer.from(price_buffer_str, 'base64').toString();
        last_price = parseFloat(price_str).toFixed(2);
      }
    }
    let last_price_defined = (!isNaN(last_price) && last_price > 0) ? true : false;

    let refPriceRow;
    if (last_price_defined) {
      refPriceRow = <tr className="MarginInfo__table__row">
        <td className="MarginInfo__table__header__item">Reference Price</td>
        <td className="MarginInfo__table__row__item">${last_price}</td>
      </tr>;
    }

    let buyingTrustline = account.getTrustlineDetails(orderbook.baseBuying);
    let sellingTrustline = account.getTrustlineDetails(orderbook.counterSelling);
    let tableContent;

    if (buyingTrustline == null || sellingTrustline == null) {
      tableContent = <tbody>
        <tr><td>Must accept the assets</td></tr>
        <tr><td>before you can start trading</td></tr>
        </tbody>
    } else {

      let buyingAsset = directory.getAssetByAccountId(orderbook.baseBuying.getCode(), orderbook.baseBuying.getIssuer());

      let baseTrustline = buyingAsset.isBaseAsset ? buyingTrustline : sellingTrustline;

      let baseTrustBalance = parseFloat(baseTrustline.balance);
      let buyingTrustDebt = parseFloat(buyingTrustline.debt);
      let sellingTrustDebt = parseFloat(sellingTrustline.debt);

      let buyingTrustName;
      if (buyingTrustDebt > 0) {
        buyingTrustName = <td className="MarginInfo__table__header__item">{buyingTrustline.asset_code} Debt</td>
      } else {
        buyingTrustName = <td className="MarginInfo__table__header__item">{buyingTrustline.asset_code} Asset</td>
      }

      let sellingTrustName;
      if (sellingTrustDebt > 0) {
        sellingTrustName = <td className="MarginInfo__table__header__item">{sellingTrustline.asset_code} Debt</td>
      } else {
        sellingTrustName = <td className="MarginInfo__table__header__item">{sellingTrustline.asset_code} Asset</td>
      }

      let maxLeverage = 10;
      let borrowed = buyingTrustDebt > 0 ? buyingTrustDebt / maxLeverage : 0;
      let leverageInfoRow;
      let profitlossRow;
      if (last_price_defined) {
        let profitloss = - (buyingTrustDebt + sellingTrustDebt / last_price);
        borrowed += sellingTrustDebt > 0 ? (sellingTrustDebt / last_price / maxLeverage) : 0;

        let lever = profitloss / baseTrustBalance;
        if (lever < 0) {
          leverageInfoRow = <tr className="MarginInfo__table__row">
            <td className="MarginInfo__table__header__item">Leverage</td>
            <td className="MarginInfo__table__row__item">{-lever.toFixed(3)}X</td>
          </tr>;
        }
        profitlossRow = <tr className="MarginInfo__table__row">
          <td className="MarginInfo__table__header__item">P/L in {baseTrustline.asset_code}</td>
          <td className="MarginInfo__table__row__item">{profitloss.toFixed(3)} ({(lever * 100).toFixed(3)}%)</td>
        </tr>;
      }

      let availableMargin = (baseTrustBalance - parseFloat(buyingTrustline.selling_liabilities) - borrowed);
      if (availableMargin < 0) availableMargin = 0;

      let liquidation = buyingTrustline.liquidation || sellingTrustline.liquidation;
      let liquidationRow;
      if (liquidation) {
        liquidationRow = <tr className="MarginInfo__table__row">
          <td className="MarginInfo__table__header__item">Liquidation Mode</td>
          <td className="MarginInfo__table__row__item">On</td>
        </tr>;
      }
      tableContent = <tbody>
        {refPriceRow}
        < tr className="MarginInfo__table__row" >
          <td className="MarginInfo__table__header__item">Collateral</td>
          <td className="MarginInfo__table__row__item">{baseTrustBalance.toFixed(3)}</td>
        </tr >
        <tr className="MarginInfo__table__row">
          <td className="MarginInfo__table__header__item">Available</td>
          <td className="MarginInfo__table__row__item">{availableMargin.toFixed(3)}</td>
        </tr>
        <tr className="MarginInfo__table__row">
          {buyingTrustName}
          <td className="MarginInfo__table__row__item">{Math.abs(buyingTrustDebt.toFixed(3))}</td>
        </tr>
        <tr className="MarginInfo__table__row">
          {sellingTrustName}
          <td className="MarginInfo__table__row__item">{Math.abs(sellingTrustDebt.toFixed(3))}</td>
        </tr>
        {profitlossRow}
        {leverageInfoRow}
        <tr className="MarginInfo__table__row">
          <td className="MarginInfo__table__header__item">Max Leverage</td>
          <td className="MarginInfo__table__row__item">{maxLeverage}x</td>
        </tr>
        {liquidationRow}
      </tbody>;
    }


    return <div className="island--pb">
      <div className="MarginInfo">
        <div className="island__sub">
          <div className=" island__sub__division">
            <h3 className="island__sub__division__title"></h3>
            <table className="MarginInfo__table">
              {tableContent}
            </table>
          </div>
        </div>
      </div>
    </div>
  }
};

