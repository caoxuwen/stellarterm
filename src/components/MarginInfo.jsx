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

    let buyingTrustline = account.getTrustlineDetails(orderbook.baseBuying);
    let sellingTrustline = account.getTrustlineDetails(orderbook.counterSelling);

    let buyingAsset = directory.getAssetByAccountId(buyingTrustline.asset_code, buyingTrustline.asset_issuer);
    let sellingAsset = directory.getAssetByAccountId(sellingTrustline.asset_code, sellingTrustline.asset_issuer);

    let baseTrustline = buyingAsset.isBaseAsset ? buyingTrustline : sellingTrustline;

    let baseTrustBalance = parseFloat(baseTrustline.balance);
    let buyingTrustDebt = parseFloat(buyingTrustline.debt);
    let sellingTrustDebt = parseFloat(sellingTrustline.debt);

    let buyingTrustName;
    if (buyingTrustDebt > 0) {
      buyingTrustName = <td className="ManageOffers__table__header__item">{buyingTrustline.asset_code} Debt</td>
    } else {
      buyingTrustName = <td className="ManageOffers__table__header__item">{buyingTrustline.asset_code} Asset</td>
    }

    let sellingTrustName;
    if (sellingTrustDebt > 0) {
      sellingTrustName = <td className="ManageOffers__table__header__item">{sellingTrustline.asset_code} Debt</td>
    } else {
      sellingTrustName = <td className="ManageOffers__table__header__item">{sellingTrustline.asset_code} Asset</td>
    }

    let last_price_defined = orderbook.trades && (orderbook.trades.length > 0) ? true : false;
    let last_price = last_price_defined ? orderbook.trades[orderbook.trades.length - 1][1] : 0;

    let leverageInfoRow;
    let profitlossRow;
    if (last_price_defined) {
      let profitloss = - (buyingTrustDebt + sellingTrustDebt / last_price);
      let lever = profitloss / baseTrustBalance;
      if (lever < 0) {
        leverageInfoRow = <tr className="ManageOffers__table__row">
          <td className="ManageOffers__table__header__item">Leverage</td>
          <td className="ManageOffers__table__row__item">{-lever.toFixed(5)}X</td>
        </tr>;
      }
      profitlossRow = <tr className="ManageOffers__table__row">
        <td className="ManageOffers__table__header__item">P/L in {baseTrustline.asset_code}</td>
        <td className="ManageOffers__table__row__item">{profitloss.toFixed(3)} ({(lever * 100).toFixed(3)}%)</td>
      </tr>;
    }

    return <div className="island--pb">
      <div className="ManageOffers">
        <div className=" island__sub">
          <div className=" island__sub__division">
            <h3 className="island__sub__division__title"></h3>
            <table className="ManageOffers__table">
              <tbody>
                <tr className="ManageOffers__table__row">
                  <td className="ManageOffers__table__header__item">Collateral</td>
                  <td className="ManageOffers__table__row__item">{baseTrustBalance.toFixed(5)}</td>
                </tr>
                <tr className="ManageOffers__table__row">
                  <td className="ManageOffers__table__header__item">Avaialble margin</td>
                  <td className="ManageOffers__table__row__item">{(baseTrustBalance - parseFloat(buyingTrustline.selling_liabilities)).toFixed(5)}</td>
                </tr>
                <tr className="ManageOffers__table__row">
                  {buyingTrustName}
                  <td className="ManageOffers__table__row__item">{Math.abs(buyingTrustDebt.toFixed(5))}</td>
                </tr>
                <tr className="ManageOffers__table__row">
                  {sellingTrustName}
                  <td className="ManageOffers__table__row__item">{Math.abs(sellingTrustDebt.toFixed(5))}</td>
                </tr>
                {profitlossRow}
                {leverageInfoRow}
              </tbody>
            </table>
          </div>
          <div className="island__sub__division">
          </div>
        </div>
      </div>
    </div>
  }
};

