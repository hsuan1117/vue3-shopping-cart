import coupon_data from '@/assets/coupon.json';

export default class Coupon {
    constructor(coupon_id) {
        this.coupon_id = coupon_id;
        this.coupon_data = coupon_data;

        if (!coupon_id.startsWith('YMK'))
            throw new Error(`優惠卷必須以 YMK 開頭: ${coupon_id}`);

        this.coupon = this.coupon_data?.[this.coupon_id]
        if (!this.coupon) {
            throw new Error(`查無優惠卷: ${this.coupon_id}`);
        }
    }

    apply(price) {
        if (this.coupon.min_price) {
            if (price < this.coupon.min_price) {
                throw new Error(`金額不足以使用這張優惠卷，仍須 ${this.coupon.min_price - price}元`);
            }
        }

        if (this.coupon.percent_off) {
            return [price * (this.coupon.percent_off / 100), this.coupon, COUPON_TYPE.PERCENT];
        }
        if (this.coupon.amount_off) {
            return [this.coupon.amount_off, this.coupon, COUPON_TYPE.AMOUNT];
        }
        if (this.coupon.ship_off) {
            return [price, this.coupon, COUPON_TYPE.SHIP];
        }
    }
}

export const COUPON_TYPE = {
    PERCENT: 'percent',
    AMOUNT: 'amount',
    SHIP: 'ship',
}